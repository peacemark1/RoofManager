const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const paymentController = require('../controllers/payment.controller');

// Webhook routes (no authentication needed, uses signature verification)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// All other routes require authentication
router.use(authenticate);

// Initialize payment for an invoice
router.post('/initialize', paymentController.initializePayment);

// Verify a payment
router.get('/verify/:reference', paymentController.verifyPayment);

// Process a refund
router.post('/refund', paymentController.processRefund);

// Get all payments for the company
router.get('/', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const payments = await prisma.payment.findMany({
      where: { companyId: req.companyId },
      include: {
        invoice: {
          include: {
            customer: true,
            job: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: payments });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get payments' }
    });
  }
});

// Get a single payment by ID
router.get('/:id', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const payment = await prisma.payment.findFirst({
      where: { id: req.params.id, companyId: req.companyId },
      include: {
        invoice: {
          include: {
            customer: true,
            job: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Payment not found' }
      });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get payment' }
    });
  }
});

module.exports = router;
