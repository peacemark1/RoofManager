const { PrismaClient } = require('@prisma/client');
const paymentService = require('../services/payment.service');
const prisma = new PrismaClient();

async function initializePayment(req, res) {
  try {
    const { invoiceId, customerEmail, customerCountry } = req.body;

    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, companyId: req.companyId },
      include: { customer: true, job: true }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Invoice not found' }
      });
    }

    if (invoice.status === 'PAID') {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_PAID', message: 'Invoice already paid' }
      });
    }

    const country = customerCountry || invoice.countryCode || 'US';
    const provider = paymentService.detectPaymentProvider(country);
    const reference = `INV-${invoice.id.slice(0, 8)}-${Date.now()}`;
    const amountDue = invoice.total - (invoice.amountPaid || 0);
    const currency = invoice.currency || 'USD';

    const paymentResult = await paymentService.initializePayment(
      provider,
      amountDue * 100,
      customerEmail || invoice.customer?.email || '',
      {
        reference,
        invoiceId: invoice.id,
        jobId: invoice.jobId,
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

    await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: amountDue,
        method: provider === 'paystack' ? 'PAYSTACK' : 'STRIPE',
        status: 'pending',
        transactionId: reference
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

async function verifyPayment(req, res) {
  try {
    const { reference } = req.params;

    const payment = await prisma.payment.findFirst({
      where: { transactionId: reference, invoice: { companyId: req.companyId } },
      include: { invoice: true }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Payment record not found' }
      });
    }

    const provider = payment.method === 'PAYSTACK' ? 'paystack' : 'stripe';
    const verification = await paymentService.verifyPayment(provider, reference);

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: { message: verification.error || 'Payment verification failed' }
      });
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'completed',
        paidAt: verification.paidAt ? new Date(verification.paidAt) : new Date()
      }
    });

    const totalPaid = await prisma.payment.aggregate({
      where: { invoiceId: payment.invoiceId, status: 'completed' },
      _sum: { amount: true }
    });

    const invoice = payment.invoice;
    const isFullyPaid = (totalPaid._sum.amount || 0) >= invoice.total;

    await prisma.invoice.update({
      where: { id: payment.invoiceId },
      data: {
        amountPaid: totalPaid._sum.amount || payment.amount,
        status: isFullyPaid ? 'PAID' : invoice.status
      }
    });

    res.json({
      success: true,
      data: {
        reference: verification.reference || reference,
        provider,
        amount: verification.amount || payment.amount,
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

async function handleWebhook(req, res) {
  try {
    const signature = req.headers['stripe-signature'] || req.headers['x-paystack-signature'];
    const provider = req.headers['x-paystack-signature'] ? 'paystack' : 'stripe';

    const eventType = provider === 'paystack'
      ? req.body?.event
      : req.body?.type;

    switch (eventType) {
      case 'charge.success':
      case 'payment_intent.succeeded': {
        const reference = provider === 'paystack'
          ? req.body?.data?.reference
          : req.body?.data?.object?.metadata?.reference;

        if (reference) {
          const payment = await prisma.payment.findFirst({
            where: { transactionId: reference },
            include: { invoice: true }
          });

          if (payment && payment.status !== 'completed') {
            await prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'completed' }
            });

            const totalPaid = await prisma.payment.aggregate({
              where: { invoiceId: payment.invoiceId, status: 'completed' },
              _sum: { amount: true }
            });

            const newPaidAmount = totalPaid._sum.amount || 0;
            await prisma.invoice.update({
              where: { id: payment.invoiceId },
              data: {
                amountPaid: newPaidAmount,
                status: newPaidAmount >= (payment.invoice?.total || 0) ? 'PAID' :
                  newPaidAmount > 0 ? 'PARTIAL' : payment.invoice?.status || 'SENT'
              }
            });
          }
        }
        break;
      }

      case 'charge.failed':
      case 'payment_intent.payment_failed': {
        const failRef = provider === 'paystack'
          ? req.body?.data?.reference
          : req.body?.data?.object?.metadata?.reference;

        if (failRef) {
          await prisma.payment.updateMany({
            where: { transactionId: failRef },
            data: { status: 'failed' }
          });
        }
        break;
      }

      case 'refund.processed':
      case 'charge.refund.updated': {
        const refundRef = provider === 'paystack'
          ? req.body?.data?.transaction_reference
          : req.body?.data?.object?.payment_intent;

        if (refundRef) {
          const payment = await prisma.payment.findFirst({
            where: { transactionId: refundRef },
            include: { invoice: true }
          });

          if (payment) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'refunded' }
            });

            const totalPaid = await prisma.payment.aggregate({
              where: { invoiceId: payment.invoiceId, status: 'completed' },
              _sum: { amount: true }
            });

            const newPaidAmount = Math.max(0, totalPaid._sum.amount || 0);
            await prisma.invoice.update({
              where: { id: payment.invoiceId },
              data: {
                amountPaid: newPaidAmount,
                status: newPaidAmount >= (payment.invoice?.total || 0) ? 'PAID' :
                  newPaidAmount > 0 ? 'PARTIAL' : 'SENT'
              }
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function getPayments(req, res) {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        invoice: { companyId: req.companyId }
      },
      include: {
        invoice: {
          include: { job: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: { payments } });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get payments' }
    });
  }
}

async function processRefund(req, res) {
  try {
    const { paymentId, amount } = req.body;

    const payment = await prisma.payment.findFirst({
      where: { id: paymentId },
      include: { invoice: { select: { companyId: true, total: true } } }
    });

    if (!payment || payment.invoice.companyId !== req.companyId) {
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

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'refunded' }
    });

    const totalPaid = await prisma.payment.aggregate({
      where: { invoiceId: payment.invoiceId, status: 'completed' },
      _sum: { amount: true }
    });

    const newPaidAmount = Math.max(0, totalPaid._sum.amount || 0);
    const invoice = await prisma.invoice.findUnique({
      where: { id: payment.invoiceId }
    });

    await prisma.invoice.update({
      where: { id: payment.invoiceId },
      data: {
        amountPaid: newPaidAmount,
        status: newPaidAmount >= (invoice?.total || 0) ? 'PAID' :
          newPaidAmount > 0 ? 'PARTIAL' : 'SENT'
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
  getPayments,
  processRefund
};
