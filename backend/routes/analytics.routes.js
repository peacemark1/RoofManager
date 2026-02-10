const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { getDashboardAnalytics } = require('../controllers/analytics.controller');

// All routes require authentication
router.use(authenticate);

router.get('/', getDashboardAnalytics);

module.exports = router;
