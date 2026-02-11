const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const invoiceController = require('../controllers/invoice.controller');

// All routes require authentication
router.use(authenticate);

router.get('/', invoiceController.getInvoices);
router.post('/', invoiceController.createInvoice);
router.get('/:id', invoiceController.getInvoice);
router.put('/:id', invoiceController.updateInvoice);

module.exports = router;
