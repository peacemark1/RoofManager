# Kilo Code: Phase 6 - Payment Integration (Paystack + Stripe)

Paystack is the primary payment gateway for African customers (Ghana, Nigeria, Kenya, South Africa). Stripe is optional for international customers.

---

## Setup: Payment Provider Configuration

Before implementing, sign up for these services:

### Paystack (Primary - for African customers)
1. Sign up at https://paystack.com (Ghana-based, perfect for you!)
2. Get your **Test Keys** from the Dashboard → Settings → API Keys
3. Add to backend `.env`:
   ```
   PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
   ```

### Stripe (Optional - for international customers)
1. Sign up at https://stripe.com
2. Get your **Test Keys** from Developers → API keys
3. Add to backend `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

---

## STEP 1: Install Payment Dependencies

```text
Install Paystack and Stripe SDKs in the backend.

In backend/ directory:
npm install paystack-api stripe

These libraries provide pre-built methods to interact with payment gateways.
```

---

## STEP 2: Create Payment Service (Backend)

```text
Create a unified payment service that handles both Paystack and Stripe.

File: backend/services/payment.service.js

Features:
1. detectPaymentProvider(country) - Returns 'paystack' for African countries, 'stripe' for others
2. initializePayment(provider, amount, email, metadata) - Start payment session
3. verifyPayment(provider, reference) - Confirm payment was successful
4. processRefund(provider, reference, amount) - Handle refunds

Use Paystack as the default for:
- Ghana (GH)
- Nigeria (NG)
- South Africa (ZA)
- Kenya (KE)

Use Stripe for all other countries.

Implementation guide in backend_implementation.md Section "Payment Integration".
```

**ATTACH:** `docs/specifications/backend_implementation.md`

---

## STEP 3: Create Payment Controllers (Backend)

```text
Build API endpoints to handle payment operations.

File: backend/controllers/payment.controller.js

Endpoints:
1. POST /payments/initialize
   - Accept: invoiceId, customerEmail, customerCountry
   - Auto-detect payment provider based on country
   - Return: payment URL or authorization URL

2. GET /payments/verify/:reference
   - Verify payment with the appropriate provider
   - Update invoice status to "paid" if successful
   - Return: payment details

3. POST /payments/webhook
   - Handle webhooks from both Paystack and Stripe
   - Verify webhook signature
   - Update invoice status based on payment events

Use the exact implementation from backend_implementation.md "Payment Webhooks" section.
```

**ATTACH:** `docs/specifications/backend_implementation.md`

---

## STEP 4: Create Payment Integration Component (Frontend)

```text
Build a React component that integrates Paystack Inline (embedded checkout).

File: frontend/components/payments/PaystackCheckout.tsx

Features:
- Accept: amount, email, reference, onSuccess, onClose callbacks
- Use @paystack/inline-js library for embedded payment
- Show loading state while initializing
- Trigger onSuccess when payment is completed
- Trigger onClose when user cancels

For Stripe (international):
File: frontend/components/payments/StripeCheckout.tsx

Use @stripe/stripe-js and @stripe/react-stripe-js for embedded checkout.

Refer to frontend_architecture.md Section "Payment Components" for implementation details.
```

**Installation:**
```bash
cd frontend
npm install @paystack/inline-js @stripe/stripe-js @stripe/react-stripe-js
```

**ATTACH:** `docs/specifications/frontend_architecture.md`

---

## STEP 5: Update Invoice Page with Payment Button

```text
Integrate payment functionality into the Invoice Detail page.

File: frontend/app/(dashboard)/invoices/[id]/page.tsx

Add a "Pay Now" button that:
1. Detects customer's country (from invoice.address or IP lookup)
2. Initializes payment with the correct provider (Paystack or Stripe)
3. Opens the payment modal
4. On success, updates the invoice status to "paid"
5. Shows a success message and refreshes the invoice data

Use the PaystackCheckout or StripeCheckout component created in Step 4.
```

---

## STEP 6: Configure Webhooks

### Paystack Webhook Setup:
```text
1. Go to https://dashboard.paystack.com/#/settings/developer
2. Add webhook URL: https://your-backend-url.com/api/payments/webhook/paystack
3. Copy the webhook secret
4. Add to backend .env:
   PAYSTACK_WEBHOOK_SECRET=sk_live_xxxxxxxxxxxxx

5. In backend/controllers/payment.controller.js, verify webhook signatures using:
   const crypto = require('crypto');
   const hash = crypto.createHmac('sha512', PAYSTACK_WEBHOOK_SECRET)
                      .update(JSON.stringify(req.body))
                      .digest('hex');
   if (hash === req.headers['x-paystack-signature']) {
     // Valid webhook
   }
```

### Stripe Webhook Setup (if using):
```text
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Forward events to local backend:
   stripe listen --forward-to localhost:3001/api/payments/webhook/stripe
3. For production, add webhook URL in Stripe Dashboard → Developers → Webhooks
```

---

## STEP 7: Test Payment Flow

### Testing with Paystack (Ghana):
```text
Paystack provides test card numbers for Ghana:

Success:
- Card: 5531 8866 5214 2950
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: 123456

Declined:
- Card: 5060 6666 6666 6666 4963

Test the flow:
1. Create an invoice in the dashboard
2. Click "Pay Now"
3. Enter test card details
4. Confirm payment with OTP
5. Verify the invoice status updates to "paid"
```

### Testing with Stripe (International):
```text
Use Stripe test cards:
- Success: 4242 4242 4242 4242
- Declined: 4000 0000 0000 0002
```

---

## STEP 8: Add Payment Status to Invoice Table

```text
Update the Invoice list page to show payment status badges.

File: frontend/app/(dashboard)/invoices/page.tsx

Add a "Payment Status" column with badges:
- Unpaid (gray)
- Processing (yellow)
- Paid (green)
- Refunded (blue)
- Failed (red)

Add a "Pay" action button for unpaid invoices.
```

---

## STEP 9: Create Payment History View

```text
Build a payment history page to track all transactions.

File: frontend/app/(dashboard)/payments/page.tsx

Features:
- Table showing: Date, Invoice#, Customer, Amount, Provider (Paystack/Stripe), Status
- Filter by provider, status, date range
- Search by customer name or reference
- Export to CSV functionality

Connect to backend endpoint: GET /api/payments
```

---

## Country-Based Payment Provider Logic

Here's the logic to determine which payment gateway to use:

```javascript
// backend/services/payment.service.js

const PAYSTACK_COUNTRIES = ['GH', 'NG', 'ZA', 'KE']; // Ghana, Nigeria, South Africa, Kenya

function getPaymentProvider(countryCode) {
  if (PAYSTACK_COUNTRIES.includes(countryCode)) {
    return 'paystack';
  }
  return 'stripe'; // Default to Stripe for international
}

// You can also let the customer choose manually in the UI
```

---

## Important Notes for Ghana 🇬🇭

1. **Currency**: Paystack supports GHS (Ghanaian Cedi). Make sure invoice amounts are in GHS for Ghanaian customers.

2. **Mobile Money**: Paystack also supports **MTN Mobile Money** and **Vodafone Cash** in Ghana. You can enable this in your Paystack dashboard.

3. **Transaction Fees**: 
   - Paystack: 1.95% + GHS 0.20 per transaction
   - Much better than Stripe's international fees!

4. **Payout Schedule**: Paystack settles to your Ghanaian bank account within 24 hours (T+1).

5. **Test Mode**: Always start in test mode. Switch to live mode only after thorough testing.

---

Refer to `docs/specifications/backend_implementation.md` and `docs/specifications/frontend_architecture.md` for complete implementation details.
