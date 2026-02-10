# RoofManager Database Schema

Complete Prisma schema for multi-tenant roofing SaaS platform.

---

## Schema File: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// TENANT MANAGEMENT
// ============================================================================

model Company {
  id                String   @id @default(uuid())
  name              String
  subdomain         String   @unique
  logo              String?
  primaryColor      String   @default("#1e40af")
  secondaryColor    String   @default("#3b82f6")
  font              String   @default("Inter")
  enabledModules    Json     @default("{\"ai\": true, \"payments\": true, \"chatbot\": true}")
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  users             User[]
  leads             Lead[]
  jobs              Job[]
  estimates         Estimate[]
  quotes            Quote[]
  invoices          Invoice[]
  materials         Material[]
  notifications     Notification[]
  chatMessages      ChatMessage[]
  subscription      Subscription?
  metrics           CompanyMetrics[]
  
  @@index([subdomain])
}

model User {
  id                String   @id @default(uuid())
  email             String   @unique
  password          String
  firstName         String
  lastName          String
  phone             String?
  role              UserRole
  isActive          Boolean  @default(true)
  
  companyId         String
  company           Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  assignedJobs      JobAssignment[]
  timeLogs          TimeLog[]
  incidentReports   IncidentReport[]
  createdEstimates  Estimate[]
  createdQuotes     Quote[]
  
  @@index([companyId])
  @@index([email])
}

enum UserRole {
  ADMIN
  ESTIMATOR
  FIELD_CREW
  FOREMAN
  CLIENT
}

model Subscription {
  id                String   @id @default(uuid())
  tier              SubscriptionTier
  status            SubscriptionStatus
  stripeCustomerId  String?
  stripeSubId       String?
  currentPeriodEnd  DateTime?
  
  companyId         String   @unique
  company           Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([companyId])
}

enum SubscriptionTier {
  FREE
  STARTER
  PROFESSIONAL
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  TRIALING
}

// ============================================================================
// LEAD & JOB PIPELINE
// ============================================================================

model Lead {
  id                String   @id @default(uuid())
  firstName         String
  lastName          String
  email             String
  phone             String
  address           String?
  source            LeadSource
  status            LeadStatus
  notes             String?
  
  companyId         String
  company           Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  jobId             String?  @unique
  job               Job?     @relation("LeadToJob")
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([companyId])
  @@index([status])
}

enum LeadSource {
  WEBSITE
  REFERRAL
  COLD_CALL
  SOCIAL_MEDIA
  ADVERTISING
  OTHER
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  CONVERTED
  LOST
}

model Job {
  id                String   @id @default(uuid())
  jobNumber         String   @unique
  title             String
  description       String?
  address           String
  latitude          Float?
  longitude         Float?
  
  propertyType      PropertyType
  roofSize          Float?    // square feet
  roofPitch         String?
  status            JobStatus
  
  scheduledStart    DateTime?
  scheduledEnd      DateTime?
  actualStart       DateTime?
  actualEnd         DateTime?
  
  estimatedCost     Float?
  actualCost        Float?
  
  companyId         String
  company           Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  leadId            String?  @unique
  lead              Lead?    @relation("LeadToJob", fields: [leadId], references: [id])
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  assignments       JobAssignment[]
  photos            JobPhoto[]
  materials         JobMaterial[]
  estimates         Estimate[]
  quotes            Quote[]
  invoices          Invoice[]
  timeLogs          TimeLog[]
  incidents         IncidentReport[]
  
  @@index([companyId])
  @@index([status])
  @@index([jobNumber])
}

enum PropertyType {
  RESIDENTIAL
  COMMERCIAL
  INDUSTRIAL
  MULTI_FAMILY
}

enum JobStatus {
  PROSPECT
  SCOUTED
  ESTIMATING
  QUOTED
  APPROVED
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  INVOICED
  PAID
  CANCELED
}

model JobAssignment {
  id                String   @id @default(uuid())
  
  jobId             String
  job               Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  role              String   // "foreman", "crew_member", etc.
  assignedAt        DateTime @default(now())
  
  @@unique([jobId, userId])
  @@index([jobId])
  @@index([userId])
}

model JobPhoto {
  id                String   @id @default(uuid())
  url               String
  caption           String?
  latitude          Float?
  longitude         Float?
  takenAt           DateTime @default(now())
  
  jobId             String
  job               Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  
  uploadedBy        String   // userId
  
  createdAt         DateTime @default(now())
  
  @@index([jobId])
}

// ============================================================================
// ESTIMATION & QUOTING
// ============================================================================

model Estimate {
  id                String   @id @default(uuid())
  laborHours        Float
  totalCost         Float
  timeline          String
  aiGenerated       Boolean  @default(false)
  aiConfidence      Float?
  notes             String?
  
  jobId             String
  job               Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  
  companyId         String
  company           Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  createdBy         String
  creator           User     @relation(fields: [createdBy], references: [id])
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  materials         EstimateMaterial[]
  
  @@index([jobId])
  @@index([companyId])
}

model EstimateMaterial {
  id                String   @id @default(uuid())
  name              String
  quantity          Float
  unit              String
  estimatedCost     Float
  
  estimateId        String
  estimate          Estimate @relation(fields: [estimateId], references: [id], onDelete: Cascade)
  
  @@index([estimateId])
}

model Quote {
  id                String   @id @default(uuid())
  quoteNumber       String   @unique
  validUntil        DateTime
  status            QuoteStatus
  pdfUrl            String?
  publicLink        String   @unique
  
  lineItems         Json     // Array of {description, quantity, unitPrice, total}
  subtotal          Float
  tax               Float    @default(0)
  discount          Float    @default(0)
  total             Float
  
  notes             String?
  termsAndConditions String?
  
  jobId             String
  job               Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  
  companyId         String
  company           Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  createdBy         String
  creator           User     @relation(fields: [createdBy], references: [id])
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  approval          QuoteApproval?
  invoice           Invoice?
  
  @@index([jobId])
  @@index([companyId])
  @@index([publicLink])
}

enum QuoteStatus {
  DRAFT
  SENT
  VIEWED
  APPROVED
  REJECTED
  EXPIRED
}

model QuoteApproval {
  id                String   @id @default(uuid())
  signatureUrl      String?
  signedBy          String   // Customer name
  signedAt          DateTime
  ipAddress         String?
  
  quoteId           String   @unique
  quote             Quote    @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  
  @@index([quoteId])
}

// ============================================================================
// INVENTORY & MATERIALS
// ============================================================================

model Material {
  id                String   @id @default(uuid())
  name              String
  description       String?
  sku               String?
  category          String
  unit              String   // "sq ft", "bundle", "piece"
  costPerUnit       Float
  stockLevel        Int      @default(0)
  reorderPoint      Int      @default(0)
  supplier          String?
  
  companyId         String
  company           Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  jobMaterials      JobMaterial[]
  purchaseOrders    PurchaseOrderItem[]
  
  @@index([companyId])
  @@index([category])
}

model JobMaterial {
  id                String   @id @default(uuid())
  quantityPlanned   Float
  quantityUsed      Float    @default(0)
  
  jobId             String
  job               Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  
  materialId        String
  material          Material @relation(fields: [materialId], references: [id])
  
  @@unique([jobId, materialId])
  @@index([jobId])
  @@index([materialId])
}

model PurchaseOrder {
  id                String   @id @default(uuid())
  poNumber          String   @unique
  supplier          String
  status            POStatus
  orderDate         DateTime @default(now())
  expectedDate      DateTime?
  receivedDate      DateTime?
  totalCost         Float
  
  items             PurchaseOrderItem[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([poNumber])
}

enum POStatus {
  DRAFT
  ORDERED
  PARTIALLY_RECEIVED
  RECEIVED
  CANCELED
}

model PurchaseOrderItem {
  id                String   @id @default(uuid())
  quantity          Float
  unitCost          Float
  totalCost         Float
  
  purchaseOrderId   String
  purchaseOrder     PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)
  
  materialId        String
  material          Material @relation(fields: [materialId], references: [id])
  
  @@index([purchaseOrderId])
  @@index([materialId])
}

// ============================================================================
// FINANCIALS
// ============================================================================

model Invoice {
  id                String   @id @default(uuid())
  invoiceNumber     String   @unique
  dueDate           DateTime
  status            InvoiceStatus
  pdfUrl            String?
  
  lineItems         Json
  subtotal          Float
  tax               Float
  total             Float
  amountPaid        Float    @default(0)
  
  jobId             String
  job               Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  
  companyId         String
  company           Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  quoteId           String?  @unique
  quote             Quote?   @relation(fields: [quoteId], references: [id])
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  payments          Payment[]
  
  @@index([jobId])
  @@index([companyId])
  @@index([invoiceNumber])
}

enum InvoiceStatus {
  DRAFT
  SENT
  VIEWED
  PARTIALLY_PAID
  PAID
  OVERDUE
  CANCELED
}

model Payment {
  id                String   @id @default(uuid())
  amount            Float
  method            PaymentMethod
  transactionId     String?
  stripePaymentId   String?
  status            PaymentStatus
  paidAt            DateTime?
  
  invoiceId         String
  invoice           Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([invoiceId])
  @@index([stripePaymentId])
}

enum PaymentMethod {
  CREDIT_CARD
  BANK_TRANSFER
  CASH
  CHECK
  MOBILE_MONEY
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

// ============================================================================
// COMMUNICATION
// ============================================================================

model Notification {
  id                String   @id @default(uuid())
  type              NotificationType
  channel           NotificationChannel
  recipient         String   // email or phone
  subject           String?
  body              String
  status            NotificationStatus
  sentAt            DateTime?
  errorMessage      String?
  
  companyId         String
  company           Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime @default(now())
  
  @@index([companyId])
  @@index([status])
}

enum NotificationType {
  QUOTE_SENT
  QUOTE_APPROVED
  JOB_ASSIGNED
  JOB_STARTING
  PAYMENT_RECEIVED
  PAYMENT_REMINDER
  GENERAL
}

enum NotificationChannel {
  EMAIL
  SMS
  PUSH
}

enum NotificationStatus {
  QUEUED
  SENT
  FAILED
  CANCELED
}

model ChatMessage {
  id                String   @id @default(uuid())
  senderId          String   // userId or "system" or "bot"
  senderName        String
  message           String
  isBot             Boolean  @default(false)
  
  companyId         String
  company           Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime @default(now())
  
  @@index([companyId])
  @@index([createdAt])
}

// ============================================================================
// ANALYTICS & OPERATIONS
// ============================================================================

model TimeLog {
  id                String   @id @default(uuid())
  startTime         DateTime
  endTime           DateTime?
  totalHours        Float?
  notes             String?
  
  jobId             String
  job               Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  
  createdAt         DateTime @default(now())
  
  @@index([jobId])
  @@index([userId])
}

model IncidentReport {
  id                String   @id @default(uuid())
  title             String
  description       String
  severity          IncidentSeverity
  resolvedAt        DateTime?
  resolution        String?
  
  jobId             String
  job               Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  
  reportedBy        String
  reporter          User     @relation(fields: [reportedBy], references: [id])
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([jobId])
  @@index([severity])
}

enum IncidentSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

model CompanyMetrics {
  id                String   @id @default(uuid())
  date              DateTime @db.Date
  
  totalRevenue      Float    @default(0)
  totalCosts        Float    @default(0)
  netProfit         Float    @default(0)
  
  leadsCreated      Int      @default(0)
  leadsConverted    Int      @default(0)
  conversionRate    Float    @default(0)
  
  jobsCompleted     Int      @default(0)
  avgJobDuration    Float?
  crewEfficiency    Float?
  
  companyId         String
  company           Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime @default(now())
  
  @@unique([companyId, date])
  @@index([companyId])
  @@index([date])
}
```

---

## Migration Commands

```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma (already done with schema above)
npx prisma init

# Generate Prisma Client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

---

## Key Design Decisions

### Multi-Tenancy Strategy
- **Approach**: Row-level isolation with `companyId` foreign key
- **Why**: Simpler than schema-per-tenant, scales well for 100s of companies
- **Middleware**: All queries automatically filtered by `companyId` from JWT

### Cascade Deletes
- Company deletion cascades to all related data
- Protects referential integrity

### Indexing Strategy
- Primary indexes on foreign keys (`companyId`, `jobId`, etc.)
- Secondary indexes on frequently queried fields (`status`, `email`, unique identifiers)

### JSON Fields
- `enabledModules`: Flexible feature flags per company
- `lineItems`: Quote/Invoice line items (avoid over-normalization)

### Enum Usage
- Strong typing for status fields
- Database-level constraints
- Easy dropdown generation in frontend
