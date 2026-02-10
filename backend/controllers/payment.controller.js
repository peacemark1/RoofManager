/**
 * Payment Controller
 * Handles payment operations for invoices using both Paystack and Stripe
 */

const { PrismaClient } = require('@prisma/client');
const paymentService = require('../services/payment.service');
const prisma = new PrismaClient();

/**
 * Initialize a payment for an invoice
 * POST /api/payments/initialize
 */
async function initializePayment(req, res) {
  try {
    const { invoiceId, customerEmail, customerCountry } = req.body;
    const companyId = req.companyId;

    // Get invoice details
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, companyId },
      include: { customer: true, job: true }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Invoice not found' }
      });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_PAID', message: 'Invoice already paid' }
      });
    }

    // Detect payment provider based on country
    const country = customerCountry || invoice.customer?.country || 'US';
    const provider = paymentService.detectPaymentProvider(country);

    // Generate unique reference
    const reference = `INV-${invoice.id}-${Date.now()}`;

    // Calculate amount in smallest currency unit
    const amountDue = invoice.totalAmount - (invoice.paidAmount || 0);
    const currency = invoice.currency || 'USD';

    // Initialize payment with the detected provider
    const paymentResult = await paymentService.initializePayment(
      provider,
      amountDue * 100, // Convert to cents/pesewas
      customerEmail || invoice.customer?.email,
      {
        reference,
        invoiceId: invoice.id,
        jobId: invoice.jobId,
        companyId,
        currency,
        callbackUrl: `${process.env.FRONTEND_URL}/payments/callback`
      }
    );

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
        amount: amountDue,
        currency,
        method: provider === 'paystack' ? 'PAYSTACK' : 'STRIPE',
        status: 'pending',
        transactionId: reference,
        metadata: {
          provider,
          ...(paymentResult.accessCode && { accessCode: paymentResult.accessCode }),
          ...(paymentResult.clientSecret && { clientSecret: paymentResult.clientSecret }),
          ...(paymentResult.paymentIntentId && { paymentIntentId: paymentResult.paymentIntentId })
        }
      }
    });

    res.json({
      success: true,
      data: {
        provider,
        reference,
        authorizationUrl: paymentResult.authorizationUrl,
        clientSecret: paymentResult.clientSecret,
        paymentIntentId: paymentResult.paymentIntentId
      }
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Payment initialization failed' }
    });
  }
}

/**
 * Verify a payment
 * GET /api/payments/verify/:reference
 */
async function verifyPayment(req, res) {
  try {
    const { reference } = req.params;
    const companyId = req.companyId;

    // Find payment record
    const payment = await prisma.payment.findFirst({
      where: { transactionId: reference, companyId },
      include: { invoice: true }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Payment record not found' }
      });
    }

    // Get provider from payment metadata
    const provider = payment.metadata?.provider || 
      (payment.method === 'PAYSTACK' ? 'paystack' : 'stripe');

    // Verify with payment provider
    const verification = await paymentService.verifyPayment(provider, reference);

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: { message: verification.error || 'Payment verification failed' }
      });
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'completed',
        paidAt: verification.paidAt ? new Date(verification.paidAt) : new Date(),
        metadata: {
          ...payment.metadata,
          channel: verification.channel,
          customerName: verification.customer?.name,
          verificationStatus: verification.status
        }
      }
    });

    // Check if invoice is fully paid
    const totalPaid = await prisma.payment.aggregate({
      where: { invoiceId: payment.invoiceId, status: 'completed' },
      _sum: { amount: true }
    });

    const invoice = await prisma.invoice.findUnique({
      where: { id: payment.invoiceId }
    });

    const isFullyPaid = (totalPaid._sum.amount || 0) >= invoice.totalAmount;

    // Update invoice status
    await prisma.invoice.update({
      where: { id: payment.invoiceId },
      data: {
        paidAmount: totalPaid._sum.amount || payment.amount,
        status: isFullyPaid ? 'paid' : invoice.status,
        paidAt: isFullyPaid ? new Date() : null
      }
    });

    res.json({
      success: true,
      data: {
        reference: verification.reference || reference,
        provider,
        amount: verification.amount || payment.amount,
        currency: verification.currency || payment.currency,
        status: 'completed',
        invoiceId: payment.invoiceId,
        isFullyPaid
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Payment verification failed' }
    });
  }
}

/**
 * Handle payment webhooks
 * POST /api/payments/webhook
 */
async function handleWebhook(req, res) {
  try {
    const signature = req.headers['stripe-signature'] || req.headers['x-paystack-signature'];
    const provider = req.headers['x-paystack-signature'] ? 'paystack' : 'stripe';

    let webhookResult;

    if (provider === 'paystack') {
      // Handle Paystack webhook
      webhookResult = paymentService.handlePaystackWebhook(req.body, signature);
    } else {
      // Handle Stripe webhook
      webhookResult = await paymentService.handleStripeWebhook(req.body, signature);
    }

    if (!webhookResult.success) {
      return res.status(401).json({ error: webhookResult.error });
    }

    const event = webhookResult.data;

    // Handle different event types
    switch (event.event || webhookResult.type) {
      case 'charge.success':
      case 'payment_intent.succeeded':
        // Payment successful
        await handlePaymentSuccess(req.body, provider, event);
        break;

      case 'charge.failed':
      case 'payment_intent.payment_failed':
        // Payment failed
        await handlePaymentFailed(req.body, provider, event);
        break;

      case 'refund.processed':
      case 'charge.refund.updated':
        // Refund processed
        await handleRefundProcessed(req.body, provider, event);
        break;

      default:
        console.log(`Unhandled webhook event: ${event.event || webhookResult.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

/**
 * Handle successful payment from webhook
 */
async function handlePaymentSuccess(payload, provider, event) {
  try {
    let reference;
    let amount;
    let invoiceId;

    if (provider === 'paystack') {
      reference = payload.data?.reference;
      amount = payload.data?.amount / 100;
      invoiceId = payload.data?.metadata?.invoiceId;
    } else {
      reference = payload.data?.payment_intent || payload.data?.id;
      amount = payload.data?.amount / 100;
      invoiceId = payload.data?.metadata?.invoiceId;
    }

    if (!reference || !invoiceId) {
      console.error('Missing reference or invoiceId in webhook');
      return;
    }

    // Find and update payment
    const payment = await prisma.payment.findFirst({
      where: { transactionId: reference }
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'completed',
          paidAt: new Date(),
          metadata: {
            ...payment.metadata,
            webhookProvider: provider,
            verifiedAt: new Date().toISOString()
          }
        }
      });

      // Update invoice
      const totalPaid = await prisma.payment.aggregate({
        where: { invoiceId: payment.invoiceId, status: 'completed' },
        _sum: { amount: true }
      });

      const invoice = await prisma.invoice.findUnique({
        where: { id: payment.invoiceId }
      });

      const isFullyPaid = (totalPaid._sum.amount || 0) >= invoice.totalAmount;

      await prisma.invoice.update({
        where: { id: payment.invoiceId },
        data: {
          paidAmount: totalPaid._sum.amount || amount,
          status: isFullyPaid ? 'paid' : 'partial',
          paidAt: isFullyPaid ? new Date() : null
        }
      });

      console.log(`Payment successful: ${reference}`);
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

/**
 * Handle failed payment from webhook
 */
async function handlePaymentFailed(payload, provider, event) {
  try {
    let reference;
    let invoiceId;

    if (provider === 'paystack') {
      reference = payload.data?.reference;
      invoiceId = payload.data?.metadata?.invoiceId;
    } else {
      reference = payload.data?.payment_intent || payload.data?.id;
      invoiceId = payload.data?.metadata?.invoiceId;
    }

    if (!reference || !invoiceId) {
      console.error('Missing reference or invoiceId in webhook');
      return;
    }

    // Find and update payment
    const payment = await prisma.payment.findFirst({
      where: { transactionId: reference }
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'failed',
          metadata: {
            ...payment.metadata,
            webhookProvider: provider,
            failureReason: payload.data?.gateway_response || payload.data?.last_payment_error?.message,
            failedAt: new Date().toISOString()
          }
        }
      });

      console.log(`Payment failed: ${reference}`);
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * Handle refund processed from webhook
 */
async function handleRefundProcessed(payload, provider, event) {
  try {
    let reference;
    let refundId;
    let amount;

    if (provider === 'paystack') {
      reference = payload.data?.transaction;
      refundId = payload.data?.id;
      amount = payload.data?.amount / 100;
    } else {
      reference = payload.data?.payment_intent || payload.data?.id;
      refundId = payload.data?.id;
      amount = payload.data?.amount / 100;
    }

    if (!reference || !refundId) {
      console.error('Missing reference or refundId in webhook');
      return;
    }

    // Find and update payment
    const payment = await prisma.payment.findFirst({
      where: { transactionId: reference }
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'refunded',
          metadata: {
            ...payment.metadata,
            refundId,
            refundAmount: amount,
            refundedAt: new Date().toISOString()
          }
        }
      });

      // Update invoice
      const invoice = await prisma.invoice.findUnique({
        where: { id: payment.invoiceId }
      });

      const totalPaid = await prisma.payment.aggregate({
        where: { invoiceId: payment.invoiceId, status: 'completed' },
        _sum: { amount: true }
      });

      const newPaidAmount = Math.max(0, (totalPaid._sum.amount || 0) - amount);

      await prisma.invoice.update({
        where: { id: payment.invoiceId },
        data: {
          paidAmount: newPaidAmount,
          status: newPaidAmount >= invoice.totalAmount ? 'paid' : 
            newPaidAmount > 0 ? 'partial' : 'unpaid'
        }
      });

      console.log(`Refund processed: ${reference}, refundId: ${refundId}`);
    }
  } catch (error) {
    console.error('Error handling refund:', error);
  }
}

/**
 * Process a refund
 * POST /api/payments/refund
 */
async function processRefund(req, res) {
  try {
    const { paymentId, amount } = req.body;
    const companyId = req.companyId;

    // Find payment
    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, companyId },
      include: { invoice: true }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Payment not found' }
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Can only refund completed payments' }
      });
    }

    const provider = payment.method === 'PAYSTACK' ? 'paystack' : 'stripe';
    const refundAmount = amount || payment.amount;

    // Process refund
    const refundResult = await paymentService.processRefund(
      provider,
      payment.transactionId,
      refundAmount
    );

    if (!refundResult.success) {
      return res.status(400).json({
        success: false,
        error: { message: refundResult.error }
      });
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'refunded',
        metadata: {
          ...payment.metadata,
          refundId: refundResult.refundId,
          refundAmount,
          refundedAt: new Date().toISOString()
        }
      }
    });

    // Update invoice
    const totalPaid = await prisma.payment.aggregate({
      where: { invoiceId: payment.invoiceId, status: 'completed' },
      _sum: { amount: true }
    });

    const newPaidAmount = Math.max(0, (totalPaid._sum.amount || 0) - refundAmount);
    const invoice = await prisma.invoice.findUnique({
      where: { id: payment.invoiceId }
    });

    await prisma.invoice.update({
      where: { id: payment.invoiceId },
      data: {
        paidAmount: newPaidAmount,
        status: newPaidAmount >= invoice.totalAmount ? 'paid' : 
          newPaidAmount > 0 ? 'partial' : 'unpaid'
      }
    });

    res.json({
      success: true,
      data: {
        refundId: refundResult.refundId,
        amount: refundResult.amount,
        status: refundResult.status
      }
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Refund processing failed' }
    });
  }
}

module.exports = {
  initializePayment,
  verifyPayment,
  handleWebhook,
  processRefund
};
