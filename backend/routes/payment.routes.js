const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const paymentController = require('../controllers/payment.controller');

// Webhook routes (no authentication needed)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// All other routes require authentication
router.use(authenticate);

router.get('/', paymentController.getPayments);
router.post('/initialize', paymentController.initializePayment);
router.get('/verify/:reference', paymentController.verifyPayment);
router.post('/refund', paymentController.processRefund);

module.exports = router;
