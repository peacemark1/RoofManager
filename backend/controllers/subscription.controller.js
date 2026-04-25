const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PLANS = {
    FREE: {
        tier: 'FREE',
        name: 'Starter',
        price: 0,
        currency: 'GHS',
        maxUsers: 3,
        maxJobs: 10,
        maxStorage: 1073741824,
        features: { ai: false, payments: true, chatbot: false, sms: false, customerPortal: false },
    },
    PRO: {
        tier: 'PRO',
        name: 'Professional',
        price: 99,
        currency: 'GHS',
        maxUsers: 10,
        maxJobs: 100,
        maxStorage: 5368709120,
        features: { ai: true, payments: true, chatbot: true, sms: true, customerPortal: true },
    },
    ENTERPRISE: {
        tier: 'ENTERPRISE',
        name: 'Enterprise',
        price: 249,
        currency: 'GHS',
        maxUsers: 50,
        maxJobs: -1,
        maxStorage: 21474836480,
        features: { ai: true, payments: true, chatbot: true, sms: true, customerPortal: true },
    },
};

async function getPlans(req, res) {
    try {
        res.json({ success: true, data: Object.values(PLANS) });
    } catch (error) {
        res.status(500).json({ success: false, error: { message: 'Failed to fetch plans' } });
    }
}

async function getCurrentSubscription(req, res) {
    try {
        const subscription = await prisma.subscription.findUnique({
            where: { companyId: req.companyId },
        });

        if (!subscription) {
            return res.status(404).json({ success: false, error: { message: 'No subscription found' } });
        }

        const plan = PLANS[subscription.tier] || PLANS.FREE;
        const memberCount = await prisma.user.count({
            where: { companyId: req.companyId, isActive: true },
        });
        const jobCount = await prisma.job.count({
            where: { companyId: req.companyId },
        });

        // Check trial status
        let isTrialActive = subscription.isTrialActive;
        let daysRemaining = 0;
        if (subscription.trialEndDate) {
            const now = new Date();
            const trialEnd = new Date(subscription.trialEndDate);
            if (trialEnd > now) {
                daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            } else {
                isTrialActive = false;
            }
        }

        res.json({
            success: true,
            data: {
                ...subscription,
                plan,
                usage: {
                    users: memberCount,
                    maxUsers: subscription.maxUsers,
                    jobs: jobCount,
                    maxJobs: subscription.maxJobs,
                },
                trial: {
                    isActive: isTrialActive,
                    daysRemaining,
                    used: subscription.trialUsed,
                },
            },
        });
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to fetch subscription' } });
    }
}

async function upgradePlan(req, res) {
    try {
        const { tier } = req.body;

        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: { message: 'Only admins can change plans' } });
        }

        const plan = PLANS[tier];
        if (!plan) {
            return res.status(400).json({ success: false, error: { message: 'Invalid plan selected' } });
        }

        const updated = await prisma.subscription.update({
            where: { companyId: req.companyId },
            data: {
                tier: plan.tier,
                maxUsers: plan.maxUsers,
                maxJobs: plan.maxJobs,
                maxStorage: plan.maxStorage,
                features: JSON.stringify(plan.features),
                status: 'ACTIVE',
            },
        });

        res.json({ success: true, data: updated, message: `Upgraded to ${plan.name} plan` });
    } catch (error) {
        console.error('Upgrade plan error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to upgrade plan' } });
    }
}

module.exports = { getPlans, getCurrentSubscription, upgradePlan, PLANS };
