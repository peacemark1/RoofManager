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
                    logoUrl: company.logoUrl || null,
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
                        logoUrl: true
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

module.exports = {
    register,
    login
};
