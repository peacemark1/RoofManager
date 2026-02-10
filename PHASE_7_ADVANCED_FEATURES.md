# Kilo Code: Phase 7 - Notifications & Customer Portal

Add email notifications, SMS (Hubtel for Ghana), analytics dashboard, and a customer-facing portal.

---

## PHASE 7A: Email Notifications

```text
Set up automated email notifications for important business events.

1. Install Nodemailer in backend:
   cd backend
   npm install nodemailer

2. Create email service at backend/services/email.service.js
   - Configure with Gmail or any SMTP provider
   - Create email templates for:
     * Quote sent to customer
     * Payment received confirmation
     * Job scheduled notification
     * Invoice reminder (for overdue invoices)

3. Create email templates at backend/templates/emails/
   - quote-sent.html
   - payment-confirmation.html
   - job-scheduled.html
   - invoice-reminder.html

4. Add email triggers in controllers:
   - Send email when quote status changes to "sent"
   - Send email when payment is verified
   - Send email when job is scheduled

Use HTML templates with your company branding.
```

**Environment Variables (.env):**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=RoofManager <noreply@roofmanager.com>
```

**ATTACH:** `docs/specifications/backend_implementation.md`

---

## PHASE 7B: SMS Notifications (Hubtel - Ghana)

```text
Integrate Hubtel SMS API for Ghana-based SMS notifications.

Hubtel is the leading SMS provider in Ghana with:
- Ghana Mobile Numbers support (MTN, Vodafone, AirtelTigo)
- Affordable rates (GHS 0.035 per SMS)
- Delivery reports
- No monthly fees

1. Sign up at https://unity.hubtel.com/account/signup

2. Install Hubtel SDK:
   cd backend
   npm install axios

3. Create SMS service at backend/services/sms.service.js
   - Use Hubtel Basic SMS API
   - Send notifications for:
     * Field crew job assignments (send to crew phone)
     * Customer appointment reminders
     * Payment confirmations
     * Urgent job updates

4. Add SMS triggers:
   - When job is assigned to crew → SMS to crew member
   - 1 day before scheduled job → SMS reminder to customer
   - When payment is received → SMS confirmation to customer

Implementation details in the SMS Integration Guide below.
```

**Environment Variables (.env):**
```
HUBTEL_CLIENT_ID=your-client-id
HUBTEL_CLIENT_SECRET=your-client-secret
HUBTEL_SENDER_ID=RoofManager
```

**ATTACH:** `docs/specifications/hubtel_sms_integration.md`

---

## PHASE 7C: Advanced Analytics Dashboard

```text
Build a comprehensive analytics dashboard for business insights.

File: frontend/app/(dashboard)/analytics/page.tsx

Features:
1. Revenue Overview:
   - Total revenue (this month, this year)
   - Revenue by month (chart)
   - Average job value
   - Payment collection rate

2. Sales Pipeline:
   - Conversion funnel (leads → quotes → jobs)
   - Win rate percentage
   - Average time to close
   - Top performing sales sources

3. Job Performance:
   - Jobs completed vs. scheduled
   - Average completion time
   - Customer satisfaction scores (if collected)
   - Crew performance metrics

4. Financial Metrics:
   - Outstanding invoices
   - Overdue payments
   - Cash flow projection
   - Payment method breakdown

Use Recharts library for charts (already installed).
Create reusable chart components in components/analytics/.
```

**ATTACH:** `docs/specifications/frontend_architecture.md`

---

## PHASE 7D: Customer Portal

```text
Build a public-facing portal where customers can view quotes and pay online.

This is separate from the main dashboard - no login required!

1. Create public routes:
   - frontend/app/customer/[token]/page.tsx
   - frontend/app/customer/[token]/quote/[quoteId]/page.tsx
   - frontend/app/customer/[token]/invoice/[invoiceId]/page.tsx

2. Features:
   - View quote details and line items
   - Accept or reject quotes with e-signature
   - View invoice and payment history
   - Pay invoices directly with Paystack
   - Track job progress (scheduled, in progress, completed)

3. Security:
   - Use secure tokens (UUID) instead of sequential IDs
   - Generate unique access links per customer
   - Tokens expire after 30 days
   - No password required - link-based access

4. Backend endpoints:
   - POST /api/quotes/generate-link/:quoteId
   - GET /api/customer/:token/quotes
   - GET /api/customer/:token/invoices
   - POST /api/customer/:token/quote/:quoteId/accept

Implementation in Customer Portal Guide below.
```

**ATTACH:** `docs/specifications/customer_portal.md`

---

## PHASE 7E: Notification Preferences

```text
Allow users to configure which notifications they want to receive.

File: frontend/app/(dashboard)/settings/notifications/page.tsx

Features:
- Toggle email notifications on/off per event type
- Toggle SMS notifications on/off per event type
- Set notification thresholds (e.g., only notify for invoices > GHS 500)
- Configure quiet hours (no SMS between 9 PM - 7 AM)

Backend:
- Store preferences in user settings table
- Check preferences before sending notifications
```

---

## Priority Order

For Kilo Code, implement in this order:

1. **Email Notifications** (30 mins) - Essential for professional communication
2. **Customer Portal** (1 hour) - Huge value add for customers
3. **SMS Notifications** (45 mins) - Great for Ghana market
4. **Analytics Dashboard** (1 hour) - Business insights

---

Refer to the detailed implementation guides in `docs/specifications/` for complete code examples.
