const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * List team members for the company
 * GET /api/team
 */
async function getTeamMembers(req, res) {
  try {
    const companyId = req.companyId;

    const members = await prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      success: true,
      data: { members }
    });
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch team members' }
    });
  }
}

/**
 * Invite a new team member
 * POST /api/team/invite
 */
async function inviteTeamMember(req, res) {
  try {
    const companyId = req.companyId;
    const { email, role } = req.body;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: { message: 'Only admins can invite team members' }
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email is required' }
      });
    }

    // Check if user already exists in this company
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.companyId === companyId) {
      return res.status(400).json({
        success: false,
        error: { message: 'User is already a member of this company' }
      });
    }

    // Check for existing pending invite
    const existingInvite = await prisma.teamInvite.findFirst({
      where: { email, companyId, status: 'PENDING' }
    });
    if (existingInvite) {
      return res.status(400).json({
        success: false,
        error: { message: 'An invitation has already been sent to this email' }
      });
    }

    // Check subscription limits
    const subscription = await prisma.subscription.findUnique({
      where: { companyId }
    });

    const currentMemberCount = await prisma.user.count({ where: { companyId } });
    const maxUsers = subscription?.maxUsers || 3;

    if (currentMemberCount >= maxUsers) {
      return res.status(403).json({
        success: false,
        error: { message: `Your plan allows ${maxUsers} team members. Please upgrade to add more.` }
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invite = await prisma.teamInvite.create({
      data: {
        email,
        role: role || 'CREW',
        token,
        companyId,
        invitedBy: req.user.id,
        expiresAt,
      }
    });

    const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invite?token=${token}`;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Team invite sent to ${email}. Invite URL: ${inviteUrl}`);
    }

    // TODO: Send invite email
    // await sendEmail({ to: email, subject: 'Team Invitation', html: `<a href="${inviteUrl}">Join Team</a>` });

    res.status(201).json({
      success: true,
      data: {
        invite: {
          id: invite.id,
          email: invite.email,
          role: invite.role,
          status: invite.status,
          expiresAt: invite.expiresAt,
        },
        ...(process.env.NODE_ENV !== 'production' && { inviteUrl })
      }
    });
  } catch (error) {
    console.error('Invite team member error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send invitation' }
    });
  }
}

/**
 * Accept team invitation
 * POST /api/team/accept-invite
 */
async function acceptInvite(req, res) {
  try {
    const { token, firstName, lastName, password, phone } = req.body;

    if (!token || !firstName || !lastName || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token, first name, last name, and password are required' }
      });
    }

    const invite = await prisma.teamInvite.findUnique({
      where: { token },
      include: { company: true }
    });

    if (!invite || invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid or expired invitation' }
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: invite.email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'An account with this email already exists' }
      });
    }

    // Check subscription member limit at acceptance time
    const subscription = await prisma.subscription.findUnique({
      where: { companyId: invite.companyId }
    });
    const currentMemberCount = await prisma.user.count({
      where: { companyId: invite.companyId }
    });
    const maxUsers = subscription?.maxUsers || 3;
    if (currentMemberCount >= maxUsers) {
      return res.status(403).json({
        success: false,
        error: { message: `This company has reached its plan limit of ${maxUsers} team members. Please ask an admin to upgrade.` }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction([
      prisma.user.create({
        data: {
          email: invite.email,
          firstName,
          lastName,
          password: hashedPassword,
          phone: phone || null,
          role: invite.role,
          companyId: invite.companyId,
          isActive: true,
          emailNotifications: '{}',
          smsNotifications: '{}',
        }
      }),
      prisma.teamInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' }
      })
    ]);

    const jwt = require('jsonwebtoken');
    const jwtToken = jwt.sign(
      { userId: result[0].id, companyId: invite.companyId, role: result[0].role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        token: jwtToken,
        user: {
          id: result[0].id,
          email: result[0].email,
          firstName: result[0].firstName,
          lastName: result[0].lastName,
          role: result[0].role,
        },
        company: {
          id: invite.company.id,
          name: invite.company.name,
          subdomain: invite.company.subdomain,
        }
      }
    });
  } catch (error) {
    console.error('Accept invite error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to accept invitation' }
    });
  }
}

/**
 * List pending invitations
 * GET /api/team/invites
 */
async function getInvites(req, res) {
  try {
    const companyId = req.companyId;

    const invites = await prisma.teamInvite.findMany({
      where: { companyId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { invites }
    });
  } catch (error) {
    console.error('Get invites error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch invitations' }
    });
  }
}

/**
 * Cancel a pending invitation
 * DELETE /api/team/invites/:id
 */
async function cancelInvite(req, res) {
  try {
    const companyId = req.companyId;
    const { id } = req.params;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: { message: 'Only admins can cancel invitations' }
      });
    }

    const invite = await prisma.teamInvite.findFirst({
      where: { id, companyId }
    });

    if (!invite) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invitation not found' }
      });
    }

    await prisma.teamInvite.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    res.json({
      success: true,
      data: { message: 'Invitation cancelled' }
    });
  } catch (error) {
    console.error('Cancel invite error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to cancel invitation' }
    });
  }
}

/**
 * Update team member role or deactivate
 * PUT /api/team/:id
 */
async function updateTeamMember(req, res) {
  try {
    const companyId = req.companyId;
    const { id } = req.params;
    const { role, isActive } = req.body;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: { message: 'Only admins can manage team members' }
      });
    }

    // Prevent self-deactivation or self-demotion
    if (id === req.user.id && (isActive === false || (role && role !== req.user.role))) {
      return res.status(400).json({
        success: false,
        error: { message: 'You cannot deactivate or change the role of your own account' }
      });
    }

    const member = await prisma.user.findFirst({
      where: { id, companyId }
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        error: { message: 'Team member not found' }
      });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      }
    });

    res.json({
      success: true,
      data: { member: updated }
    });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update team member' }
    });
  }
}

module.exports = {
  getTeamMembers,
  inviteTeamMember,
  acceptInvite,
  getInvites,
  cancelInvite,
  updateTeamMember
};
