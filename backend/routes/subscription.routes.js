const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { getPlans, getCurrentSubscription, upgradePlan } = require('../controllers/subscription.controller');

router.get('/plans', getPlans);
router.get('/current', authenticate, getCurrentSubscription);
router.post('/upgrade', authenticate, upgradePlan);

module.exports = router;
