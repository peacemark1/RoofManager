const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { createEstimate, getEstimate, updateEstimate, getEstimates, startTrial, getTrialStatus } = require('../controllers/estimate.controller');

// All routes require authentication
router.use(authenticate);

// GET /api/estimates - List estimates
router.get('/', getEstimates);

// POST /api/estimates - Create estimate (with optional AI generation)
router.post('/', createEstimate);

// GET /api/estimates/:id - Get estimate
router.get('/:id', getEstimate);

// PATCH /api/estimates/:id - Update estimate
router.patch('/:id', updateEstimate);

// Trial management routes
// POST /api/estimates/start-trial - Start free trial
router.post('/start-trial', startTrial);

// GET /api/estimates/trial-status - Get trial status
router.get('/trial-status', getTrialStatus);

module.exports = router;
