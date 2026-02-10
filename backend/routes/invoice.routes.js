const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Placeholder routes - implement as needed
router.get('/', (req, res) => {
  res.json({ success: true, data: { invoices: [] } });
});

module.exports = router;
