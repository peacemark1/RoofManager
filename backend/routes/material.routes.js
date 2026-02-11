const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const materialController = require('../controllers/material.controller');

// All routes require authentication
router.use(authenticate);

router.get('/', materialController.getMaterials);
router.post('/', materialController.createMaterial);

module.exports = router;
