/**
 * Settings Routes
 * Routes for user and company settings
 */

const express = require('express')
const router = express.Router()
const settingsController = require('../controllers/settings.controller')
const authMiddleware = require('../middleware/auth.middleware')

// All routes require authentication
router.use(authMiddleware)

/**
 * @route   GET /api/settings
 * @desc    Get all user settings
 * @access  Private
 */
router.get('/', settingsController.getSettings)

/**
 * @route   GET /api/settings/notifications
 * @desc    Get notification preferences
 * @access  Private
 */
router.get('/notifications', settingsController.getNotificationPreferences)

/**
 * @route   PUT /api/settings/notifications
 * @desc    Update notification preferences
 * @access  Private
 */
router.put('/notifications', settingsController.updateNotificationPreferences)

module.exports = router
