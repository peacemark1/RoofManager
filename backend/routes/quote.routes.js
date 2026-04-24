const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const quoteController = require('../controllers/quote.controller');

// Public routes (no auth required) - must be before authenticate middleware
router.get('/public/:publicLink', quoteController.getPublicQuote);
router.post('/public/:publicLink/approve', quoteController.approvePublicQuote);

// Authenticated routes
router.use(authenticate);

router.get('/', quoteController.getQuotes);
router.post('/', quoteController.createQuote);
router.get('/:id', quoteController.getQuote);
router.patch('/:id', quoteController.updateQuote);
router.post('/:id/send', quoteController.sendQuote);
router.post('/:id/generate-pdf', quoteController.generatePDF);
router.post('/:id/regenerate-link', quoteController.regeneratePublicLink);

module.exports = router;
