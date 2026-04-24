const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createInvoice(req, res) {
    try {
        const { dueDate, items, jobId, tax, discount, notes } = req.body;

        const count = await prisma.invoice.count({
            where: { companyId: req.companyId }
        });
        const invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;

        let finalJobId = jobId;
        if (!finalJobId) {
            const firstJob = await prisma.job.findFirst({ where: { companyId: req.companyId } });
            if (!firstJob) {
                return res.status(400).json({ success: false, error: { message: 'No job selected and no jobs found.' } });
            }
            finalJobId = firstJob.id;
        }

        const lineItems = Array.isArray(items) ? items : [];
        const subtotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        const taxAmount = tax !== undefined ? parseFloat(tax) : subtotal * 0.08;
        const discountAmount = discount !== undefined ? parseFloat(discount) : 0;
        const total = subtotal + taxAmount - discountAmount;

        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                dueDate: new Date(dueDate),
                lineItems: JSON.stringify(lineItems),
                status: 'DRAFT',
                subtotal,
                tax: taxAmount,
                total,
                companyId: req.companyId,
                jobId: finalJobId
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
                include: { job: true, customer: true }
            }),
            prisma.invoice.count({ where: { companyId: req.companyId } })
        ]);

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
            include: { job: true, payments: true, customer: true }
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
    try {
        const { id } = req.params;
        const { status, dueDate, items, tax, discount } = req.body;

        const existing = await prisma.invoice.findFirst({
            where: { id, companyId: req.companyId }
        });

        if (!existing) {
            return res.status(404).json({ success: false, error: { message: 'Invoice not found' } });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (dueDate) updateData.dueDate = new Date(dueDate);
        if (items) {
            const lineItems = Array.isArray(items) ? items : [];
            updateData.lineItems = JSON.stringify(lineItems);
            updateData.subtotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
            updateData.tax = tax !== undefined ? parseFloat(tax) : updateData.subtotal * 0.08;
            const disc = discount !== undefined ? parseFloat(discount) : 0;
            updateData.total = updateData.subtotal + updateData.tax - disc;
        }

        const invoice = await prisma.invoice.update({
            where: { id },
            data: updateData
        });

        res.json({ success: true, data: invoice });
    } catch (error) {
        console.error('Update invoice error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to update invoice' } });
    }
}

module.exports = {
    createInvoice,
    getInvoices,
    getInvoice,
    updateInvoice
};
