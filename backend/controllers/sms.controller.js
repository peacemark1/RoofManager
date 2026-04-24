const smsService = require('../services/sms.service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function notifyJobAssignment(req, res) {
  try {
    const { jobId, crewMemberId } = req.body;
    const companyId = req.companyId;

    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId }
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

    await prisma.notification.create({
      data: {
        companyId,
        type: 'JOB_ASSIGNMENT',
        channel: 'sms',
        recipient: crewMember.phone,
        subject: 'Job Assignment',
        body: `New job: ${job.customerName || job.title} at ${job.address}`,
        status: result.success ? 'sent' : 'failed',
        sentAt: result.success ? new Date() : null
      }
    });

    res.json({ success: result.success, data: result });
  } catch (error) {
    console.error('Job notification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send notification' }
    });
  }
}

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

    await prisma.notification.create({
      data: {
        companyId,
        type: 'PAYMENT_RECEIVED',
        channel: 'sms',
        recipient: invoice.customer.phone,
        subject: 'Payment Confirmation',
        body: `Payment received: GHS ${(amount || invoice.total).toLocaleString()}`,
        status: result.success ? 'sent' : 'failed',
        sentAt: result.success ? new Date() : null
      }
    });

    res.json({ success: result.success, data: result });
  } catch (error) {
    console.error('Payment notification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send notification' }
    });
  }
}

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

    await prisma.notification.create({
      data: {
        companyId,
        type: 'APPOINTMENT_REMINDER',
        channel: 'sms',
        recipient: job.customer.phone,
        subject: 'Appointment Reminder',
        body: `Reminder: Job scheduled for ${job.scheduledStart ? new Date(job.scheduledStart).toLocaleDateString() : 'TBD'}`,
        status: result.success ? 'sent' : 'failed',
        sentAt: result.success ? new Date() : null
      }
    });

    res.json({ success: result.success, data: result });
  } catch (error) {
    console.error('Reminder error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send reminder' }
    });
  }
}

async function notifyQuoteReady(req, res) {
  try {
    const { quoteId } = req.body;
    const companyId = req.companyId;

    const quote = await prisma.quote.findFirst({
      where: { id: quoteId, companyId },
      include: { customer: true, job: true }
    });

    if (!quote) {
      return res.status(400).json({
        success: false,
        error: { message: 'Quote not found' }
      });
    }

    const phone = quote.customer?.phone || quote.customerPhone;
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: { message: 'No phone number for customer' }
      });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    const message = `Hi${quote.customerName ? ' ' + quote.customerName : ''}, your quote from ${company?.name || 'RoofManager'} is ready. View it here: ${process.env.FRONTEND_URL}/quote/${quote.publicLink}`;

    const result = await smsService.sendSMS({ to: phone, message });

    await prisma.notification.create({
      data: {
        companyId,
        type: 'QUOTE_READY',
        channel: 'sms',
        recipient: phone,
        subject: 'Quote Ready',
        body: message,
        status: result.success ? 'sent' : 'failed',
        sentAt: result.success ? new Date() : null
      }
    });

    res.json({ success: result.success, data: result });
  } catch (error) {
    console.error('Quote notification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send notification' }
    });
  }
}

async function notifyJobComplete(req, res) {
  try {
    const { jobId } = req.body;
    const companyId = req.companyId;

    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
      include: { customer: true }
    });

    if (!job || !job.customer?.phone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Job not found or customer has no phone' }
      });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    const message = `Hi ${job.customerName || 'Customer'}, your job "${job.title}" has been completed by ${company?.name || 'RoofManager'}. Thank you for your business!`;

    const result = await smsService.sendSMS({ to: job.customer.phone, message });

    await prisma.notification.create({
      data: {
        companyId,
        type: 'JOB_COMPLETE',
        channel: 'sms',
        recipient: job.customer.phone,
        subject: 'Job Completed',
        body: message,
        status: result.success ? 'sent' : 'failed',
        sentAt: result.success ? new Date() : null
      }
    });

    res.json({ success: result.success, data: result });
  } catch (error) {
    console.error('Job complete notification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send notification' }
    });
  }
}

async function sendCustomSMS(req, res) {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: { message: 'Phone number and message are required' }
      });
    }

    const result = await smsService.sendSMS({ to, message });

    await prisma.notification.create({
      data: {
        companyId: req.companyId,
        type: 'CUSTOM_SMS',
        channel: 'sms',
        recipient: to,
        subject: 'Custom SMS',
        body: message,
        status: result.success ? 'sent' : 'failed',
        sentAt: result.success ? new Date() : null
      }
    });

    res.json({ success: result.success, data: result });
  } catch (error) {
    console.error('Custom SMS error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send SMS' }
    });
  }
}

async function checkBalance(req, res) {
  try {
    const result = await smsService.getBalance();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to check balance' } });
  }
}

async function checkStatus(req, res) {
  try {
    const { messageId } = req.params;
    const result = await smsService.checkDeliveryStatus(messageId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to check status' } });
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
