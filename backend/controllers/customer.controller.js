/**
 * Customer Controller
 * Handles public customer portal access via secure tokens
 */

const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Generate secure access link for customer
 * POST /api/customer/generate-link
 */
async function generateAccessLink(req, res) {
  try {
    const { email, customerId } = req.body;
    const companyId = req.companyId;

    // Find customer
    let customer = await prisma.customer.findFirst({
      where: customerId ? { id: customerId, companyId } : { email, companyId }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Customer not found' }
      });
    }

    // Check if token needs regeneration
    const needsNewToken = !customer.accessToken || 
      new Date() > new Date(customer.tokenExpiresAt);

    if (needsNewToken) {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          accessToken: crypto.randomUUID(),
          tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
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

/**
 * Get customer portal data by token
 * GET /api/customer/:token
 */
async function getCustomerData(req, res) {
  try {
    const { token } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        accessToken: token,
        tokenExpiresAt: { gte: new Date() }
      },
      include: {
        quotes: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: true
          }
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          include: {
            payments: true
          }
        },
        jobs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invalid or expired link' }
      });
    }

    // Get company info
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
          totalAmount: q.totalAmount,
          status: q.status,
          createdAt: q.createdAt,
          validUntil: q.validUntil,
          items: q.items
        })),
        invoices: customer.invoices.map(i => ({
          id: i.id,
          invoiceNumber: i.invoiceNumber || i.id.slice(0, 8),
          totalAmount: i.totalAmount,
          paidAmount: i.paidAmount,
          status: i.status,
          dueDate: i.dueDate,
          createdAt: i.createdAt,
          payments: i.payments
        })),
        jobs: customer.jobs.map(j => ({
          id: j.id,
          title: j.title,
          status: j.status,
          startDate: j.startDate,
          scheduledEndDate: j.scheduledEndDate,
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

/**
 * Get quote detail for customer
 * GET /api/customer/:token/quote/:quoteId
 */
async function getQuoteDetail(req, res) {
  try {
    const { token, quoteId } = req.params;

    // Verify customer token
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
      where: {
        id: quoteId,
        customerId: customer.id
      },
      include: {
        items: true,
        company: true
      }
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
          totalAmount: quote.totalAmount,
          status: quote.status,
          createdAt: quote.createdAt,
          validUntil: quote.validUntil,
          notes: quote.notes,
          items: quote.items,
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone
          },
          company: {
            name: quote.company?.name || 'RoofManager',
            phone: quote.company?.phone,
            email: quote.company?.email
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

/**
 * Accept quote (with optional e-signature)
 * POST /api/customer/:token/quote/:quoteId/accept
 */
async function acceptQuote(req, res) {
  try {
    const { token, quoteId } = req.params;
    const { signature, signatureData } = req.body;

    // Verify customer token
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
      where: {
        id: quoteId,
        customerId: customer.id
      }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: { message: 'Quote not found' }
      });
    }

    if (quote.status !== 'sent') {
      return res.status(400).json({
        success: false,
        error: { message: 'Quote cannot be accepted in current status' }
      });
    }

    // Update quote status
    const updatedQuote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status: 'accepted',
        acceptedAt: new Date(),
        customerSignature: signature || signatureData,
        signedViaPortal: true
      }
    });

    // Optionally create a job from the accepted quote
    const existingJob = await prisma.job.findFirst({
      where: { quoteId: quoteId }
    });

    if (!existingJob) {
      const job = await prisma.job.create({
        data: {
          companyId: customer.companyId,
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          address: quote.address,
          title: `Roofing Job - ${customer.name}`,
          description: quote.description,
          estimatedCost: quote.totalAmount,
          status: 'scheduled',
          quoteId: quoteId,
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 1 week out
        }
      });

      res.json({
        success: true,
        data: { quote: updatedQuote, job }
      });
    } else {
      res.json({
        success: true,
        data: { quote: updatedQuote, job: existingJob }
      });
    }
  } catch (error) {
    console.error('Accept quote error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to accept quote' }
    });
  }
}

/**
 * Reject quote
 * POST /api/customer/:token/quote/:quoteId/reject
 */
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

    const updatedQuote = await prisma.quote.update({
      where: { id: quoteId, customerId: customer.id },
      data: {
        status: 'rejected',
        rejectedAt: new Date(),
        rejectionReason: reason
      }
    });

    res.json({
      success: true,
      data: { quote: updatedQuote }
    });
  } catch (error) {
    console.error('Reject quote error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to reject quote' }
    });
  }
}

/**
 * Get invoice detail for customer
 * GET /api/customer/:token/invoice/:invoiceId
 */
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
      where: {
        id: invoiceId,
        customerId: customer.id
      },
      include: {
        items: true,
        payments: true,
        company: true
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invoice not found' }
      });
    }

    const amountDue = invoice.totalAmount - (invoice.paidAmount || 0);

    res.json({
      success: true,
      data: {
        invoice: {
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber || invoice.id.slice(0, 8),
          totalAmount: invoice.totalAmount,
          paidAmount: invoice.paidAmount || 0,
          amountDue,
          status: invoice.status,
          dueDate: invoice.dueDate,
          createdAt: invoice.createdAt,
          items: invoice.items,
          payments: invoice.payments,
          currency: invoice.currency || 'USD',
          countryCode: invoice.countryCode || 'US',
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone
          },
          company: {
            name: invoice.company?.name || 'RoofManager',
            phone: invoice.company?.phone,
            email: invoice.company?.email
          }
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

/**
 * Get job detail for customer
 * GET /api/customer/:token/job/:jobId
 */
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
      where: {
        id: jobId,
        customerId: customer.id
      },
      include: {
        photos: true,
        crew: {
          include: {
            user: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: { message: 'Job not found' }
      });
    }

    res.json({
      success: true,
      data: {
        job: {
          id: job.id,
          title: job.title,
          status: job.status,
          startDate: job.startDate,
          scheduledEndDate: job.scheduledEndDate,
          completedAt: job.actualEndDate,
          address: job.address,
          description: job.description,
          notes: job.notes || [],
          timeline: [],
          quote: null,
          invoice: null,
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone
          },
          company: {
            name: job.company?.name || 'RoofManager',
            phone: job.company?.phone,
            email: job.company?.email
          }
        }
      }
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
