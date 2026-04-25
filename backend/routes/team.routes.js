const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public route - accept invite (no auth needed)
router.post('/accept-invite', teamController.acceptInvite);

// Protected routes
router.use(authenticate);

router.get('/', teamController.getTeamMembers);
router.post('/invite', teamController.inviteTeamMember);
router.get('/invites', teamController.getInvites);
router.delete('/invites/:id', teamController.cancelInvite);
router.put('/:id', teamController.updateTeamMember);

module.exports = router;
