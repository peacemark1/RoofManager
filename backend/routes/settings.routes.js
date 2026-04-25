/**
 * Settings Routes
 * Routes for user and company settings
 */

const express = require('express')
const router = express.Router()
const settingsController = require('../controllers/settings.controller')
const authMiddleware = require('../middleware/auth.middleware')

// All routes require authentication
router.use(authMiddleware.authenticate)

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

/**
 * @route   PUT /api/settings/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', settingsController.updateProfile)

/**
 * @route   PUT /api/settings/company
 * @desc    Update company settings
 * @access  Private (Admin only)
 */
router.put('/company', settingsController.updateCompany)

module.exports = router
