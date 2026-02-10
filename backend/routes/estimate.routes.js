const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { createEstimate, getEstimate, updateEstimate } = require('../controllers/estimate.controller');

// All routes require authentication
router.use(authenticate);

// POST /api/estimates - Create estimate (with optional AI generation)
router.post('/', createEstimate);

// GET /api/estimates/:id - Get estimate
router.get('/:id', getEstimate);

// PATCH /api/estimates/:id - Update estimate
router.patch('/:id', updateEstimate);

module.exports = router;
