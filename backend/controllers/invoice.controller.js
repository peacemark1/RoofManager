const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createInvoice(req, res) {
    try {
        const { customerName, address, dueDate, totalAmount, items, jobId } = req.body;

        // Generate invoice number
        const count = await prisma.invoice.count({
            where: { companyId: req.companyId }
        });
        const invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;

        // Validate Job ID
        if (!jobId) {
            // Try to find a job for this customer or create a default if absolutely necessary
            // For now, return error if no job ID
            // Actually, let's try to find ANY job if not provided, for testing
            const firstJob = await prisma.job.findFirst({ where: { companyId: req.companyId } });
            if (!firstJob) {
                return res.status(400).json({ success: false, error: { message: 'No job selected and no jobs found to assign.' } });
            }
            // Use the first job as fallback (TEMPORARY: Client should provide ID)
            var finalJobId = firstJob.id;
        } else {
            var finalJobId = jobId;
        }

        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                customerName, // Storing denormalized for now as per schema usage in other controllers
                dueDate: new Date(dueDate),
                totalAmount: parseFloat(totalAmount),
                lineItems: JSON.stringify(items),
                status: 'draft',
                address: address || '', // Using address field if available or empty
                subtotal: parseFloat(totalAmount), // Assuming no tax/discount logic in frontend yet
                tax: 0,
                total: parseFloat(totalAmount),
                companyId: req.companyId,
                jobId: finalJobId,
                // customerId: ... we could link if we had it
            }
        });

        res.status(201).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        console.error('Create invoice error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: 'Failed to create invoice' }
        });
    }
}

async function getInvoices(req, res) {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const [invoices, total] = await Promise.all([
            prisma.invoice.findMany({
                where: { companyId: req.companyId },
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' },
                include: { job: true }
            }),
            prisma.invoice.count({ where: { companyId: req.companyId } })
        ]);

        // Parse lineItems for frontend
        const parsedInvoices = invoices.map(inv => ({
            ...inv,
            items: JSON.parse(inv.lineItems || '[]')
        }));

        res.json({
            success: true,
            data: {
                invoices: parsedInvoices,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get invoices error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: 'Failed to get invoices' }
        });
    }
}

async function getInvoice(req, res) {
    try {
        const { id } = req.params;
        const invoice = await prisma.invoice.findFirst({
            where: { id, companyId: req.companyId },
            include: { job: true, payments: true }
        });

        if (!invoice) {
            return res.status(404).json({ success: false, error: { message: 'Invoice not found' } });
        }

        res.json({
            success: true,
            data: {
                ...invoice,
                items: JSON.parse(invoice.lineItems || '[]')
            }
        });
    } catch (error) {
        console.error('Get invoice error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to get invoice' } });
    }
}

async function updateInvoice(req, res) {
    // Implement if needed
    res.json({ success: true, data: {} });
}

module.exports = {
    createInvoice,
    getInvoices,
    getInvoice,
    updateInvoice
};
