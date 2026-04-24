const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateAccessLink(req, res) {
  try {
    const { email, customerId } = req.body;
    const companyId = req.companyId;

    let customer = await prisma.customer.findFirst({
      where: customerId ? { id: customerId, companyId } : { email, companyId }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Customer not found' }
      });
    }

    const needsNewToken = !customer.accessToken ||
      !customer.tokenExpiresAt || new Date() > new Date(customer.tokenExpiresAt);

    if (needsNewToken) {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          accessToken: crypto.randomUUID(),
          tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }

    const accessUrl = `${process.env.FRONTEND_URL}/customer/${customer.accessToken}`;

    res.json({
      success: true,
      data: {
        accessUrl,
        expiresAt: customer.tokenExpiresAt,
        customerId: customer.id
      }
    });
  } catch (error) {
    console.error('Access link error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to generate access link' }
    });
  }
}

async function getCustomerData(req, res) {
  try {
    const { token } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        accessToken: token,
        tokenExpiresAt: { gte: new Date() }
      },
      include: {
        quotes: { orderBy: { createdAt: 'desc' } },
        invoices: {
          orderBy: { createdAt: 'desc' },
          include: { payments: true }
        },
        jobs: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invalid or expired link' }
      });
    }

    const company = await prisma.company.findUnique({
      where: { id: customer.companyId }
    });

    res.json({
      success: true,
      data: {
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        },
        company: {
          name: company?.name || 'RoofManager',
          logo: company?.logo,
          phone: company?.phone,
          email: company?.email
        },
        quotes: customer.quotes.map(q => ({
          id: q.id,
          quoteNumber: q.quoteNumber,
          total: q.total,
          status: q.status,
          createdAt: q.createdAt,
          validUntil: q.validUntil,
          lineItems: typeof q.lineItems === 'string' ? JSON.parse(q.lineItems) : q.lineItems
        })),
        invoices: customer.invoices.map(i => ({
          id: i.id,
          invoiceNumber: i.invoiceNumber,
          total: i.total,
          amountPaid: i.amountPaid,
          status: i.status,
          dueDate: i.dueDate,
          createdAt: i.createdAt,
          payments: i.payments
        })),
        jobs: customer.jobs.map(j => ({
          id: j.id,
          title: j.title,
          status: j.status,
          scheduledStart: j.scheduledStart,
          scheduledEnd: j.scheduledEnd,
          address: j.address
        }))
      }
    });
  } catch (error) {
    console.error('Customer data error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch data' }
    });
  }
}

async function getQuoteDetail(req, res) {
  try {
    const { token, quoteId } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        accessToken: token,
        tokenExpiresAt: { gte: new Date() }
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invalid or expired link' }
      });
    }

    const quote = await prisma.quote.findFirst({
      where: { id: quoteId, customerId: customer.id },
      include: { company: true }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: { message: 'Quote not found' }
      });
    }

    res.json({
      success: true,
      data: {
        quote: {
          id: quote.id,
          quoteNumber: quote.quoteNumber,
          total: quote.total,
          subtotal: quote.subtotal,
          tax: quote.tax,
          discount: quote.discount,
          status: quote.status,
          validUntil: quote.validUntil,
          notes: quote.notes,
          termsAndConditions: quote.termsAndConditions,
          lineItems: typeof quote.lineItems === 'string' ? JSON.parse(quote.lineItems) : quote.lineItems,
          company: {
            name: quote.company.name,
            logo: quote.company.logo
          }
        }
      }
    });
  } catch (error) {
    console.error('Quote detail error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch quote' }
    });
  }
}

async function acceptQuote(req, res) {
  try {
    const { token, quoteId } = req.params;
    const { signedBy, signatureData } = req.body;

    const customer = await prisma.customer.findFirst({
      where: {
        accessToken: token,
        tokenExpiresAt: { gte: new Date() }
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invalid or expired link' }
      });
    }

    const quote = await prisma.quote.findFirst({
      where: { id: quoteId, customerId: customer.id }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: { message: 'Quote not found' }
      });
    }

    if (quote.status === 'APPROVED') {
      return res.status(400).json({
        success: false,
        error: { message: 'Quote already approved' }
      });
    }

    await prisma.quoteApproval.create({
      data: {
        quoteId: quote.id,
        signedBy: signedBy || customer.name,
        signedAt: new Date(),
        signatureUrl: signatureData || null,
        ipAddress: req.ip
      }
    });

    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'APPROVED' }
    });

    res.json({
      success: true,
      data: { message: 'Quote accepted successfully' }
    });
  } catch (error) {
    console.error('Accept quote error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to accept quote' }
    });
  }
}

async function rejectQuote(req, res) {
  try {
    const { token, quoteId } = req.params;
    const { reason } = req.body;

    const customer = await prisma.customer.findFirst({
      where: {
        accessToken: token,
        tokenExpiresAt: { gte: new Date() }
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invalid or expired link' }
      });
    }

    const quote = await prisma.quote.findFirst({
      where: { id: quoteId, customerId: customer.id }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: { message: 'Quote not found' }
      });
    }

    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'REJECTED', notes: reason ? `Rejected: ${reason}` : quote.notes }
    });

    res.json({
      success: true,
      data: { message: 'Quote rejected' }
    });
  } catch (error) {
    console.error('Reject quote error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to reject quote' }
    });
  }
}

async function getInvoiceDetail(req, res) {
  try {
    const { token, invoiceId } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        accessToken: token,
        tokenExpiresAt: { gte: new Date() }
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invalid or expired link' }
      });
    }

    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, customerId: customer.id },
      include: { payments: true, job: true }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invoice not found' }
      });
    }

    res.json({
      success: true,
      data: {
        invoice: {
          ...invoice,
          lineItems: typeof invoice.lineItems === 'string' ? JSON.parse(invoice.lineItems) : invoice.lineItems
        }
      }
    });
  } catch (error) {
    console.error('Invoice detail error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch invoice' }
    });
  }
}

async function getJobDetail(req, res) {
  try {
    const { token, jobId } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        accessToken: token,
        tokenExpiresAt: { gte: new Date() }
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invalid or expired link' }
      });
    }

    const job = await prisma.job.findFirst({
      where: { id: jobId, customerId: customer.id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: { message: 'Job not found' }
      });
    }

    res.json({
      success: true,
      data: { job }
    });
  } catch (error) {
    console.error('Job detail error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch job' }
    });
  }
}

module.exports = {
  generateAccessLink,
  getCustomerData,
  getQuoteDetail,
  acceptQuote,
  rejectQuote,
  getInvoiceDetail,
  getJobDetail
};
