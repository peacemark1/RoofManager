const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes (no authentication - token-based access)
router.get('/:token', customerController.getCustomerData);
router.get('/:token/quote/:quoteId', customerController.getQuoteDetail);
router.post('/:token/quote/:quoteId/accept', customerController.acceptQuote);
router.post('/:token/quote/:quoteId/reject', customerController.rejectQuote);
router.get('/:token/invoice/:invoiceId', customerController.getInvoiceDetail);
router.get('/:token/job/:jobId', customerController.getJobDetail);

// Protected routes (require authentication)
router.use(authenticate);
router.post('/generate-link', customerController.generateAccessLink);

module.exports = router;
