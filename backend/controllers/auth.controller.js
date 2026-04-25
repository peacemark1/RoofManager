const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Register a new company and admin user
 */
async function register(req, res) {
    try {
        const { company, user } = req.body;

        // Check if company subdomain already exists
        const existingCompany = await prisma.company.findUnique({
            where: { subdomain: company.subdomain }
        });

        if (existingCompany) {
            return res.status(400).json({
                success: false,
                error: { message: 'Company subdomain already exists' }
            });
        }

        // Check if user email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: { message: 'Email already registered' }
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Create company and admin user in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create company
            const newCompany = await tx.company.create({
                data: {
                    name: company.name,
                    subdomain: company.subdomain,
                    email: company.email || user.email,
                    phone: company.phone || user.phone,
                    address: company.address || '',
                    city: company.city || '',
                    state: company.state || '',
                    zipCode: company.zipCode || '',
                    country: company.country || 'US',
                    timezone: company.timezone || 'America/New_York',
                    currency: company.currency || 'USD',
                    logo: company.logoUrl || null,
                    website: company.website || null,
                    primaryColor: company.primaryColor || '#1e40af',
                    secondaryColor: company.secondaryColor || '#3b82f6',
                    font: company.font || 'Inter',
                    enabledModules: company.enabledModules || '{"ai": true, "payments": true, "chatbot": true}'
                }
            });

            // Create admin user
            const newUser = await tx.user.create({
                data: {
                    companyId: newCompany.id,
                    email: user.email,
                    password: hashedPassword,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: 'ADMIN',
                    isActive: true,
                    emailNotifications: '{}',
                    smsNotifications: '{}'
                }
            });

            // Create default subscription (FREE tier)
            await tx.subscription.create({
                data: {
                    companyId: newCompany.id,
                    tier: 'FREE',
                    status: 'ACTIVE',
                    startDate: new Date(),
                    billingCycle: 'MONTHLY',
                    maxUsers: 3,
                    maxJobs: 10,
                    maxStorage: 1073741824, // 1GB in bytes
                    features: '{"ai": false, "payments": true, "chatbot": false}'
                }
            });

            return { company: newCompany, user: newUser };
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: result.user.id,
                companyId: result.company.id,
                role: result.user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                    role: result.user.role
                },
                company: {
                    id: result.company.id,
                    name: result.company.name,
                    subdomain: result.company.subdomain
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Registration failed', details: error.message }
        });
    }
}

/**
 * Login user
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Find user with company
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        subdomain: true,
                        logo: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid credentials' }
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                error: { message: 'Account is inactive' }
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid credentials' }
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                companyId: user.companyId,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    avatarUrl: user.avatarUrl
                },
                company: user.company
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Login failed', details: error.message }
        });
    }
}

/**
 * Request password reset — sends a reset link via email
 */
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
        }

        // Generate a secure token
        const crypto = require('crypto');
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.passwordReset.create({
            data: { userId: user.id, token, expiresAt }
        });

        // Send reset email
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;
        const { sendEmail } = require('../services/email.service');
        await sendEmail({
            to: user.email,
            subject: 'Reset Your RoofManager Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #0891b2 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0;">RoofManager</h1>
                    </div>
                    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
                        <h2>Password Reset</h2>
                        <p>Hi ${user.firstName},</p>
                        <p>We received a request to reset your password. Click the button below to choose a new password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetLink}" style="background: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                                Reset Password
                            </a>
                        </div>
                        <p style="color: #6b7280; font-size: 14px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
                    </div>
                </div>
            `
        });

        res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to process request' } });
    }
}

/**
 * Reset password using a token
 */
async function resetPassword(req, res) {
    try {
        const { token, password } = req.body;

        const resetRecord = await prisma.passwordReset.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid or expired reset token' }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetRecord.userId },
                data: { password: hashedPassword }
            }),
            prisma.passwordReset.update({
                where: { id: resetRecord.id },
                data: { used: true }
            })
        ]);

        res.json({ success: true, message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to reset password' } });
    }
}

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
};
