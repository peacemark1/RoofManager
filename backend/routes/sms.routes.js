const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const smsController = require('../controllers/sms.controller');

// All routes require authentication
router.use(authenticate);

// Send custom SMS
router.post('/send', smsController.sendCustomSMS);

// Job notifications
router.post('/notify-job-assignment', smsController.notifyJobAssignment);
router.post('/notify-complete', smsController.notifyJobComplete);

// Payment notifications
router.post('/notify-payment', smsController.notifyPaymentReceived);

// Appointment reminders
router.post('/send-reminder', smsController.sendAppointmentReminder);

// Quote notifications
router.post('/notify-quote', smsController.notifyQuoteReady);

// Admin functions
router.get('/balance', smsController.checkBalance);
router.get('/status/:messageId', smsController.checkStatus);

module.exports = router;
