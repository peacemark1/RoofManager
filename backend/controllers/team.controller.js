const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * List all team members for the current company
 */
async function getTeamMembers(req, res) {
    try {
        const members = await prisma.user.findMany({
            where: { companyId: req.companyId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                isActive: true,
                lastLogin: true,
                avatarUrl: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ success: true, data: members });
    } catch (error) {
        console.error('Get team members error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to fetch team members' } });
    }
}

/**
 * Invite a new team member
 */
async function inviteTeamMember(req, res) {
    try {
        const { email, firstName, lastName, phone, role, password } = req.body;

        // Only admins can invite
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                error: { message: 'Only admins can invite team members' },
            });
        }

        // Check subscription limits
        const memberCount = await prisma.user.count({
            where: { companyId: req.companyId, isActive: true },
        });

        const subscription = await prisma.subscription.findUnique({
            where: { companyId: req.companyId },
        });

        if (subscription && memberCount >= subscription.maxUsers) {
            return res.status(403).json({
                success: false,
                error: { message: `Your plan allows up to ${subscription.maxUsers} team members. Please upgrade to add more.` },
            });
        }

        // Check if email already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({
                success: false,
                error: { message: 'A user with this email already exists' },
            });
        }

        const hashedPassword = await bcrypt.hash(password || 'changeme123', 10);

        const newUser = await prisma.user.create({
            data: {
                companyId: req.companyId,
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone: phone || null,
                role: role || 'CREW',
                isActive: true,
                emailNotifications: '{}',
                smsNotifications: '{}',
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });

        // Send welcome email (non-blocking)
        try {
            const { sendEmail } = require('../services/email.service');
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            await sendEmail({
                to: email,
                subject: `You've been invited to RoofManager`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #0891b2 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: white; margin: 0;">RoofManager</h1>
                        </div>
                        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
                            <h2>Welcome to the team!</h2>
                            <p>Hi ${firstName},</p>
                            <p>You've been invited to join <strong>${req.user.company.name}</strong> on RoofManager.</p>
                            <p>Your login credentials:</p>
                            <ul>
                                <li><strong>Email:</strong> ${email}</li>
                                <li><strong>Password:</strong> ${password || 'changeme123'}</li>
                            </ul>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${frontendUrl}/login" style="background: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                                    Sign In
                                </a>
                            </div>
                            <p style="color: #6b7280; font-size: 14px;">Please change your password after your first login.</p>
                        </div>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error('Failed to send invite email:', emailError);
        }

        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error('Invite team member error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to invite team member' } });
    }
}

/**
 * Update a team member's role or status
 */
async function updateTeamMember(req, res) {
    try {
        const { id } = req.params;
        const { role, isActive, firstName, lastName, phone } = req.body;

        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                error: { message: 'Only admins can update team members' },
            });
        }

        // Prevent self-deactivation
        if (id === req.user.id && isActive === false) {
            return res.status(400).json({
                success: false,
                error: { message: 'You cannot deactivate your own account' },
            });
        }

        // Verify member belongs to same company
        const member = await prisma.user.findFirst({
            where: { id, companyId: req.companyId },
        });

        if (!member) {
            return res.status(404).json({
                success: false,
                error: { message: 'Team member not found' },
            });
        }

        const updateData = {};
        if (role !== undefined) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (phone !== undefined) updateData.phone = phone;

        const updated = await prisma.user.update({
            where: { id },
            data: updateData,
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
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error('Update team member error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to update team member' } });
    }
}

/**
 * Remove a team member (soft delete — deactivate)
 */
async function removeTeamMember(req, res) {
    try {
        const { id } = req.params;

        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                error: { message: 'Only admins can remove team members' },
            });
        }

        if (id === req.user.id) {
            return res.status(400).json({
                success: false,
                error: { message: 'You cannot remove yourself' },
            });
        }

        const member = await prisma.user.findFirst({
            where: { id, companyId: req.companyId },
        });

        if (!member) {
            return res.status(404).json({
                success: false,
                error: { message: 'Team member not found' },
            });
        }

        await prisma.user.update({
            where: { id },
            data: { isActive: false },
        });

        res.json({ success: true, message: 'Team member removed' });
    } catch (error) {
        console.error('Remove team member error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to remove team member' } });
    }
}

module.exports = { getTeamMembers, inviteTeamMember, updateTeamMember, removeTeamMember };
