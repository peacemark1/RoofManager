# Paystack Integration Guide for RoofManager (Ghana)

Complete implementation guide for Paystack payment processing in Ghana.

---

## Backend Implementation

### Payment Service (`backend/services/payment.service.js`)

```javascript
const axios = require('axios');
const crypto = require('crypto');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

class PaystackService {
  // Initialize a payment transaction
  async initializePayment({ email, amount, reference, metadata = {} }) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email,
          amount: amount * 100, // Convert to pesewas (GHS cents)
          reference,
          currency: 'GHS',
          metadata,
          callback_url: `${process.env.FRONTEND_URL}/payments/callback`
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        authorizationUrl: response.data.data.authorization_url,
        accessCode: response.data.data.access_code,
        reference: response.data.data.reference
      };
    } catch (error) {
      console.error('Paystack initialization error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment initialization failed'
      };
    }
  }

  // Verify a payment transaction
  async verifyPayment(reference) {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
          }
        }
      );

      const transaction = response.data.data;

      return {
        success: transaction.status === 'success',
        amount: transaction.amount / 100, // Convert back to GHS
        currency: transaction.currency,
        reference: transaction.reference,
        paidAt: transaction.paid_at,
        channel: transaction.channel, // card, bank, mobile_money, etc.
        customer: {
          email: transaction.customer.email,
          name: `${transaction.customer.first_name} ${transaction.customer.last_name}`
        },
        metadata: transaction.metadata
      };
    } catch (error) {
      console.error('Paystack verification error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment verification failed'
      };
    }
  }

  // Process a refund
  async refundPayment({ reference, amount }) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/refund`,
        {
          transaction: reference,
          amount: amount ? amount * 100 : undefined // Optional partial refund
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        refundId: response.data.data.id,
        amount: response.data.data.amount / 100,
        status: response.data.data.status
      };
    } catch (error) {
      console.error('Paystack refund error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Refund failed'
      };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');

    return hash === signature;
  }
}

module.exports = new PaystackService();
```

---

### Payment Controller (`backend/controllers/payment.controller.js`)

```javascript
const paystackService = require('../services/payment.service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Initialize payment
async function initializePayment(req, res) {
  try {
    const { invoiceId } = req.body;
    const companyId = req.companyId;

    // Get invoice details
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, companyId },
      include: { job: true }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invoice not found' }
      });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({
        success: false,
        error: { message: 'Invoice already paid' }
      });
    }

    // Generate unique reference
    const reference = `INV-${invoice.id}-${Date.now()}`;

    // Initialize Paystack payment
    const paymentResult = await paystackService.initializePayment({
      email: invoice.customerEmail,
      amount: invoice.totalAmount - invoice.paidAmount,
      reference,
      metadata: {
        invoiceId: invoice.id,
        jobId: invoice.jobId,
        companyId
      }
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        error: { message: paymentResult.error }
      });
    }

    // Save payment record
    await prisma.payment.create({
      data: {
        companyId,
        invoiceId: invoice.id,
        amount: invoice.totalAmount - invoice.paidAmount,
        method: 'paystack',
        status: 'pending',
        transactionId: reference,
        metadata: { accessCode: paymentResult.accessCode }
      }
    });

    res.json({
      success: true,
      data: {
        authorizationUrl: paymentResult.authorizationUrl,
        reference
      }
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Payment initialization failed' }
    });
  }
}

// Verify payment
async function verifyPayment(req, res) {
  try {
    const { reference } = req.params;

    // Verify with Paystack
    const verification = await paystackService.verifyPayment(reference);

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: { message: 'Payment verification failed' }
      });
    }

    // Update payment record
    const payment = await prisma.payment.findFirst({
      where: { transactionId: reference }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Payment record not found' }
      });
    }

    await prisma.$transaction([
      // Update payment
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'completed',
          paidAt: new Date(verification.paidAt),
          metadata: {
            ...payment.metadata,
            channel: verification.channel,
            customerName: verification.customer.name
          }
        }
      }),

      // Update invoice
      prisma.invoice.update({
        where: { id: payment.invoiceId },
        data: {
          paidAmount: { increment: payment.amount },
          status: 'paid'
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        reference: verification.reference,
        amount: verification.amount,
        paidAt: verification.paidAt
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Payment verification failed' }
    });
  }
}

// Handle Paystack webhooks
async function handleWebhook(req, res) {
  try {
    const signature = req.headers['x-paystack-signature'];

    // Verify webhook signature
    if (!paystackService.verifyWebhookSignature(req.body, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        // Payment successful - already handled in verifyPayment
        console.log('Payment successful:', event.data.reference);
        break;

      case 'charge.failed':
        // Mark payment as failed
        await prisma.payment.updateMany({
          where: { transactionId: event.data.reference },
          data: { status: 'failed' }
        });
        break;

      case 'refund.processed':
        // Handle refund
        await prisma.payment.updateMany({
          where: { transactionId: event.data.transaction_reference },
          data: { 
            status: 'refunded',
            metadata: { refundId: event.data.id }
          }
        });
        break;

      default:
        console.log('Unhandled event:', event.event);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

module.exports = {
  initializePayment,
  verifyPayment,
  handleWebhook
};
```

---

## Frontend Implementation

### Paystack Checkout Component (`frontend/components/payments/PaystackCheckout.tsx`)

```tsx
"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface PaystackCheckoutProps {
  email: string
  amount: number
  reference: string
  onSuccess: (reference: string) => void
  onClose: () => void
}

export default function PaystackCheckout({
  email,
  amount,
  reference,
  onSuccess,
  onClose
}: PaystackCheckoutProps) {
  const openPaystack = () => {
    // @ts-ignore - Paystack is loaded via script tag
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100, // Convert to pesewas
      currency: 'GHS',
      ref: reference,
      onClose: () => {
        onClose()
      },
      callback: (response: any) => {
        onSuccess(response.reference)
      }
    })

    handler.openIframe()
  }

  useEffect(() => {
    // Load Paystack inline script
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <Button onClick={openPaystack} size="lg" className="w-full">
      Pay GHS {amount.toLocaleString()} with Paystack
    </Button>
  )
}
```

---

## Testing in Ghana

### Test Cards
```
Success (Any bank):
Card: 5531 8866 5214 2950
CVV: 123
Expiry: 01/30
PIN: 1234
OTP: 123456

Insufficient Funds:
Card: 5060 6666 6666 6666 4963
```

### Mobile Money Testing
Paystack automatically provides test Mobile Money credentials in test mode.

---

## Go Live Checklist

1. ✅ Switch to Live API keys in production `.env`
2. ✅ Update webhook URL to production backend
3. ✅ Enable Mobile Money in Paystack Dashboard (Settings → Payment Channels)
4. ✅ Add your bank account for settlements (Settings → Settlement)
5. ✅ Complete KYC verification in Paystack Dashboard
6. ✅ Test with small real transaction (GHS 1)
7. ✅ Monitor first few transactions closely

---

## Support

- Paystack Ghana Support: support@paystack.com
- Paystack Ghana WhatsApp: +233 30 291 1839
- Documentation: https://paystack.com/docs
