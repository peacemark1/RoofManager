const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { forgotPassword, resetPassword } = require('../controllers/passwordReset.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

module.exports = router;
