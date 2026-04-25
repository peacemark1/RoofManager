const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { getTeamMembers, inviteTeamMember, updateTeamMember, removeTeamMember } = require('../controllers/team.controller');

router.get('/', authenticate, getTeamMembers);
router.post('/invite', authenticate, authorize('ADMIN'), inviteTeamMember);
router.put('/:id', authenticate, authorize('ADMIN'), updateTeamMember);
router.delete('/:id', authenticate, authorize('ADMIN'), removeTeamMember);

module.exports = router;
