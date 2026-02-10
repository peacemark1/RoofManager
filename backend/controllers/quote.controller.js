const { PrismaClient } = require('@prisma/client');
const { generateQuotePDF } = require('../quotes/generator');
const { sendQuoteEmail, sendQuoteApprovedEmail } = require('../notifications/email');
const crypto = require('crypto');
const prisma = new PrismaClient();

function generatePublicLink() {
  return crypto.randomBytes(16).toString('hex');
}

function calculateQuoteTotals(lineItems, discount = 0) {
  const subtotal = lineItems.reduce((sum, item) => sum + Number(item.total), 0);
  const taxRate = 0.08; // 8% tax rate
  const tax = (subtotal - discount) * taxRate;
  const total = subtotal - discount + tax;
  return { subtotal, tax, total };
}

async function createQuote(req, res) {
  try {
    const { 
      jobId, 
      estimateId, 
      validUntil, 
      lineItems, 
      subtotal, 
      tax, 
      discount, 
      total, 
      notes, 
      termsAndConditions 
    } = req.body;

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: jobId, companyId: req.companyId },
      include: { lead: true }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job not found' }
      });
    }

    // Calculate quote number
    const lastQuote = await prisma.quote.findFirst({
      where: { companyId: req.companyId },
      orderBy: { createdAt: 'desc' }
    });
    
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const sequence = lastQuote ? 
      parseInt(lastQuote.quoteNumber.split('-').pop()) + 1 : 1;
    const quoteNumber = `QT-${year}${month}-${String(sequence).padStart(3, '0')}`;

    // Calculate totals
    const totals = calculateQuoteTotals(lineItems, discount || 0);

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        validUntil: new Date(validUntil),
        status: 'DRAFT',
        publicLink: generatePublicLink(),
        lineItems,
        subtotal: totals.subtotal,
        tax: totals.tax,
        discount: discount || 0,
        total: totals.total,
        notes,
        termsAndConditions,
        jobId,
        companyId: req.companyId,
        createdBy: req.user.id
      },
      include: {
        job: true,
        company: true
      }
    });

    // Update job status
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'QUOTED' }
    });

    res.status(201).json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create quote' }
    });
  }
}

async function getQuote(req, res) {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findFirst({
      where: { id, companyId: req.companyId },
      include: {
        job: {
          include: {
            lead: true,
            photos: true
          }
        },
        company: {
          include: {
            users: {
              where: { role: 'ADMIN' },
              select: { email: true, firstName: true }
            }
          }
        },
        creator: {
          select: { id: true, firstName: true, lastName: true }
        },
        approval: true
      }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Quote not found' }
      });
    }

    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get quote' }
    });
  }
}

async function getQuotes(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const where = { companyId: req.companyId };
    if (status) where.status = status;

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        include: {
          job: {
            select: { title: true, address: true }
          },
          creator: {
            select: { firstName: true, lastName: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.quote.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        quotes,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get quotes' }
    });
  }
}

async function updateQuote(req, res) {
  try {
    const { id } = req.params;
    const { lineItems, subtotal, tax, discount, total, notes, termsAndConditions, validUntil, status } = req.body;

    const existingQuote = await prisma.quote.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existingQuote) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Quote not found' }
      });
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        ...(lineItems && { lineItems }),
        ...(subtotal !== undefined && { subtotal }),
        ...(tax !== undefined && { tax }),
        ...(discount !== undefined && { discount }),
        ...(total !== undefined && { total }),
        ...(notes !== undefined && { notes }),
        ...(termsAndConditions !== undefined && { termsAndConditions }),
        ...(validUntil && { validUntil: new Date(validUntil) }),
        ...(status && { status })
      }
    });

    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('Update quote error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update quote' }
    });
  }
}

async function sendQuote(req, res) {
  try {
    const { id } = req.params;
    const { recipientEmail, message } = req.body;

    const quote = await prisma.quote.findFirst({
      where: { id, companyId: req.companyId },
      include: {
        job: { include: { lead: true } },
        company: true
      }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Quote not found' }
      });
    }

    // Generate PDF
    const pdfResult = await generateQuotePDF(quote, quote.company);

    // Update quote with PDF URL
    await prisma.quote.update({
      where: { id },
      data: {
        pdfUrl: pdfResult.url,
        status: 'SENT'
      }
    });

    // Send email
    const publicUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/quotes/${quote.publicLink}`;
    await sendQuoteEmail(quote, quote.company, publicUrl);

    res.json({
      success: true,
      data: {
        quoteId: id,
        status: 'SENT',
        pdfUrl: pdfResult.url,
        sentAt: new Date()
      }
    });
  } catch (error) {
    console.error('Send quote error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to send quote' }
    });
  }
}

async function generatePDF(req, res) {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findFirst({
      where: { id, companyId: req.companyId },
      include: {
        job: true,
        company: true,
        approval: true
      }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Quote not found' }
      });
    }

    const pdfResult = await generateQuotePDF(quote, quote.company);

    // Update quote with PDF URL
    await prisma.quote.update({
      where: { id },
      data: { pdfUrl: pdfResult.url }
    });

    res.json({
      success: true,
      data: {
        filename: pdfResult.filename,
        url: pdfResult.url
      }
    });
  } catch (error) {
    console.error('Generate PDF error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate PDF' }
    });
  }
}

// Public routes (no authentication required)

async function getPublicQuote(req, res) {
  try {
    const { publicLink } = req.params;

    const quote = await prisma.quote.findUnique({
      where: { publicLink },
      include: {
        job: {
          include: {
            lead: {
              select: { firstName: true, lastName: true, email: true, phone: true }
            }
          }
        },
        company: {
          select: { 
            id: true, name: true, logo: true, primaryColor: true, subdomain: true 
          }
        },
        approval: true
      }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Quote not found' }
      });
    }

    // Check if expired
    if (new Date(quote.validUntil) < new Date() && quote.status !== 'APPROVED') {
      await prisma.quote.update({
        where: { publicLink },
        data: { status: 'EXPIRED' }
      });
      quote.status = 'EXPIRED';
    }

    // Mark as viewed if sent
    if (quote.status === 'SENT') {
      await prisma.quote.update({
        where: { publicLink },
        data: { status: 'VIEWED' }
      });
    }

    res.json({
      success: true,
      data: {
        id: quote.id,
        quoteNumber: quote.quoteNumber,
        lineItems: quote.lineItems,
        subtotal: quote.subtotal,
        tax: quote.tax,
        discount: quote.discount,
        total: quote.total,
        notes: quote.notes,
        termsAndConditions: quote.termsAndConditions,
        validUntil: quote.validUntil,
        status: quote.status,
        company: quote.company,
        job: {
          title: quote.job.title,
          address: quote.job.address,
          propertyType: quote.job.propertyType,
          customerName: `${quote.job.lead?.firstName || ''} ${quote.job.lead?.lastName || ''}`.trim(),
          customerEmail: quote.job.lead?.email,
          customerPhone: quote.job.lead?.phone
        },
        approval: quote.approval
      }
    });
  } catch (error) {
    console.error('Get public quote error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get quote' }
    });
  }
}

async function approvePublicQuote(req, res) {
  try {
    const { publicLink } = req.params;
    const { signedBy, signatureData } = req.body;

    const quote = await prisma.quote.findUnique({
      where: { publicLink },
      include: { company: true }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Quote not found' }
      });
    }

    // Check if expired
    if (new Date(quote.validUntil) < new Date()) {
      return res.status(400).json({
        success: false,
        error: { code: 'EXPIRED', message: 'Quote has expired' }
      });
    }

    // Check if already approved
    if (quote.status === 'APPROVED') {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_APPROVED', message: 'Quote has already been approved' }
      });
    }

    // Create approval record
    await prisma.quoteApproval.create({
      data: {
        quoteId: quote.id,
        signedBy,
        signedAt: new Date(),
        signatureUrl: signatureData, // In production, upload to cloud storage
        ipAddress: req.ip
      }
    });

    // Update quote status
    await prisma.quote.update({
      where: { publicLink },
      data: { status: 'APPROVED' }
    });

    // Update job status
    await prisma.job.update({
      where: { id: quote.jobId },
      data: { status: 'APPROVED' }
    });

    // Send notification email to admin
    await sendQuoteApprovedEmail(quote, quote.company);

    res.json({
      success: true,
      data: {
        quoteId: quote.id,
        status: 'APPROVED',
        approval: {
          signedBy,
          signedAt: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Approve quote error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to approve quote' }
    });
  }
}

async function regeneratePublicLink(req, res) {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Quote not found' }
      });
    }

    const newPublicLink = generatePublicLink();

    await prisma.quote.update({
      where: { id },
      data: { publicLink: newPublicLink }
    });

    res.json({
      success: true,
      data: {
        publicLink: newPublicLink,
        publicUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/quotes/${newPublicLink}`
      }
    });
  } catch (error) {
    console.error('Regenerate public link error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to regenerate public link' }
    });
  }
}

module.exports = {
  createQuote,
  getQuote,
  getQuotes,
  updateQuote,
  sendQuote,
  generatePDF,
  getPublicQuote,
  approvePublicQuote,
  regeneratePublicLink
};
