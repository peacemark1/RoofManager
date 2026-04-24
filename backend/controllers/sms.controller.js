/**
 * SMS Controller
 * Handles SMS notification endpoints
 */

const smsService = require('../services/sms.service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Send job assignment notification to crew member
 * POST /api/sms/notify-job-assignment
 */
async function notifyJobAssignment(req, res) {
  try {
    const { jobId, crewMemberId } = req.body;
    const companyId = req.companyId;

    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
      include: { customer: true }
    });

    const crewMember = await prisma.user.findFirst({
      where: { id: crewMemberId, companyId }
    });

    if (!job || !crewMember) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid job or crew member' }
      });
    }

    if (!crewMember.phone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Crew member has no phone number' }
      });
    }

    const result = await smsService.notifyCrewAssignment(crewMember, job);

    // Log SMS in database
    await prisma.notification.create({
      data: {
        companyId,
        type: 'sms',
        channel: 'hubtel',
        recipient: crewMember.phone,
        subject: 'Job Assignment',
        body: `New job: ${job.customerName || ''} at ${job.address}`,
        status: result.success ? 'sent' : 'failed',
      }
    });

    res.json({
      success: result.success,
      data: result
    });
  } catch (error) {
    console.error('Job notification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send notification' }
    });
  }
}

/**
 * Send payment confirmation to customer
 * POST /api/sms/notify-payment
 */
async function notifyPaymentReceived(req, res) {
  try {
    const { invoiceId, amount } = req.body;
    const companyId = req.companyId;

    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, companyId },
      include: { customer: true }
    });

    if (!invoice) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invoice not found' }
      });
    }

    if (!invoice.customer?.phone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Customer has no phone number' }
      });
    }

    const result = await smsService.notifyPaymentReceived(
      invoice.customer,
      invoice.id,
      amount || invoice.total
    );

    // Log SMS
    await prisma.notification.create({
      data: {
        companyId,
        type: 'sms',
        channel: 'hubtel',
        recipient: invoice.customer.phone,
        subject: 'Payment Confirmation',
        body: `Payment received: GHS ${(amount || invoice.total).toLocaleString()}`,
        status: result.success ? 'sent' : 'failed',
      }
    });

    res.json({
      success: result.success,
      data: result
    });
  } catch (error) {
    console.error('Payment notification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send notification' }
    });
  }
}

/**
 * Send appointment reminder to customer
 * POST /api/sms/send-reminder
 */
async function sendAppointmentReminder(req, res) {
  try {
    const { jobId } = req.body;
    const companyId = req.companyId;

    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
      include: { customer: true }
    });

    if (!job) {
      return res.status(400).json({
        success: false,
        error: { message: 'Job not found' }
      });
    }

    if (!job.customer?.phone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Customer has no phone number' }
      });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    const result = await smsService.sendAppointmentReminder(
      job.customer,
      job,
      company?.name || 'RoofManager'
    );

    // Log SMS
    await prisma.notification.create({
      data: {
        companyId,
        type: 'sms',
        channel: 'hubtel',
        recipient: job.customer.phone,
        subject: 'Appointment Reminder',
        body: `Reminder: Job scheduled for ${new Date(job.scheduledStart).toLocaleDateString()}`,
        status: result.success ? 'sent' : 'failed',
      }
    });

    res.json({
      success: result.success,
      data: result
    });
  } catch (error) {
    console.error('Reminder error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send reminder' }
    });
  }
}

/**
 * Send quote ready notification
 * POST /api/sms/notify-quote
 */
async function notifyQuoteReady(req, res) {
  try {
    const { quoteId } = req.body;
    const companyId = req.companyId;

    const quote = await prisma.quote.findFirst({
      where: { id: quoteId, companyId },
      include: { customer: true }
    });

    if (!quote) {
      return res.status(400).json({
        success: false,
        error: { message: 'Quote not found' }
      });
    }

    if (!quote.customer?.phone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Customer has no phone number' }
      });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    const result = await smsService.notifyQuoteReady(
      quote.customer,
      quote,
      company?.name || 'RoofManager'
    );

    // Log SMS
    await prisma.notification.create({
      data: {
        companyId,
        type: 'sms',
        channel: 'hubtel',
        recipient: quote.customer.phone,
        subject: 'Quote Ready',
        body: `Quote #${quote.quoteNumber} is ready`,
        status: result.success ? 'sent' : 'failed',
      }
    });

    res.json({
      success: result.success,
      data: result
    });
  } catch (error) {
    console.error('Quote notification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send notification' }
    });
  }
}

/**
 * Send job completion notification
 * POST /api/sms/notify-complete
 */
async function notifyJobComplete(req, res) {
  try {
    const { jobId } = req.body;
    const companyId = req.companyId;

    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
      include: { customer: true }
    });

    if (!job) {
      return res.status(400).json({
        success: false,
        error: { message: 'Job not found' }
      });
    }

    if (!job.customer?.phone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Customer has no phone number' }
      });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    const result = await smsService.notifyJobComplete(
      job.customer,
      job,
      company?.name || 'RoofManager'
    );

    // Log SMS
    await prisma.notification.create({
      data: {
        companyId,
        type: 'sms',
        channel: 'hubtel',
        recipient: job.customer.phone,
        subject: 'Job Complete',
        body: `Job at ${job.address} is complete`,
        status: result.success ? 'sent' : 'failed',
      }
    });

    res.json({
      success: result.success,
      data: result
    });
  } catch (error) {
    console.error('Completion notification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send notification' }
    });
  }
}

/**
 * Send custom SMS
 * POST /api/sms/send
 */
async function sendCustomSMS(req, res) {
  try {
    const { to, message } = req.body;
    const companyId = req.companyId;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: { message: 'Phone number and message are required' }
      });
    }

    const result = await smsService.sendSMS({ to, message });

    // Log SMS
    await prisma.notification.create({
      data: {
        companyId,
        type: 'sms',
        channel: 'hubtel',
        recipient: to,
        subject: 'Custom Message',
        body: message.substring(0, 100),
        status: result.success ? 'sent' : 'failed',
      }
    });

    res.json({
      success: result.success,
      data: result
    });
  } catch (error) {
    console.error('Custom SMS error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send SMS' }
    });
  }
}

/**
 * Check SMS balance
 * GET /api/sms/balance
 */
async function checkBalance(req, res) {
  try {
    const balance = await smsService.getBalance();
    res.json(balance);
  } catch (error) {
    console.error('Balance check error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to check balance' }
    });
  }
}

/**
 * Check message delivery status
 * GET /api/sms/status/:messageId
 */
async function checkStatus(req, res) {
  try {
    const { messageId } = req.params;
    const status = await smsService.checkDeliveryStatus(messageId);
    res.json(status);
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to check status' }
    });
  }
}

module.exports = {
  notifyJobAssignment,
  notifyPaymentReceived,
  sendAppointmentReminder,
  notifyQuoteReady,
  notifyJobComplete,
  sendCustomSMS,
  checkBalance,
  checkStatus
};
