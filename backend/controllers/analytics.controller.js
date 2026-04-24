const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getDashboardAnalytics(req, res) {
    try {
        const companyId = req.companyId;

        const [leadsCount, jobsCount, invoicesCount] = await Promise.all([
            prisma.lead.count({ where: { companyId } }),
            prisma.job.count({ where: { companyId, status: { not: 'COMPLETED' } } }),
            prisma.invoice.count({ where: { companyId, status: 'SENT' } })
        ]);

        // Calculate revenue from paid invoices
        const paidInvoices = await prisma.invoice.findMany({
            where: { companyId, status: 'PAID' },
            select: { total: true }
        });
        const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

        // Get pipeline stages
        const leadsByStatus = await prisma.lead.groupBy({
            by: ['status'],
            where: { companyId },
            _count: { _all: true }
        });

        const pipelineStages = leadsByStatus.map(s => ({
            name: s.status,
            count: s._count._all,
            value: 0
        }));

        // Recent activity
        const [recentLeads, recentJobs] = await Promise.all([
            prisma.lead.findMany({
                where: { companyId },
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, firstName: true, lastName: true, createdAt: true, status: true }
            }),
            prisma.job.findMany({
                where: { companyId },
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, title: true, createdAt: true, status: true }
            })
        ]);

        const activity = [
            ...recentLeads.map(l => ({ type: 'lead', title: `New lead: ${l.firstName} ${l.lastName}`, time: l.createdAt, status: l.status })),
            ...recentJobs.map(j => ({ type: 'job', title: `Job: ${j.title}`, time: j.createdAt, status: j.status }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

        // Monthly revenue data for charts
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyInvoices = await prisma.invoice.findMany({
            where: {
                companyId,
                status: 'PAID',
                createdAt: { gte: sixMonthsAgo }
            },
            select: { total: true, createdAt: true }
        });

        const monthlyRevenue = {};
        monthlyInvoices.forEach(inv => {
            const month = new Date(inv.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + inv.total;
        });

        const revenueChart = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
            month,
            revenue
        }));

        res.json({
            success: true,
            data: {
                stats: [
                    { name: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: 'DollarSign' },
                    { name: 'Active Leads', value: leadsCount.toString(), icon: 'Users' },
                    { name: 'Active Jobs', value: jobsCount.toString(), icon: 'Briefcase' },
                    { name: 'Pending Invoices', value: invoicesCount.toString(), icon: 'FileText' }
                ],
                pipelineStages,
                recentActivity: activity,
                revenueChart
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch analytics' }
        });
    }
}

module.exports = {
    getDashboardAnalytics
};
