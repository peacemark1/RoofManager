const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  convertLeadToJob
} = require('../controllers/lead.controller');

// All routes require authentication
router.use(authenticate);

// POST /api/leads - Create lead
router.post('/', createLead);

// GET /api/leads - List leads with pagination and filters
router.get('/', getLeads);

// GET /api/leads/:id - Get single lead
router.get('/:id', getLead);

// PATCH /api/leads/:id - Update lead
router.patch('/:id', updateLead);

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', deleteLead);

// POST /api/leads/:id/convert - Convert lead to job
router.post('/:id/convert', convertLeadToJob);

module.exports = router;
