/**
 * Email Service
 * Handles sending transactional emails via SMTP
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Template directory
const TEMPLATES_DIR = path.join(__dirname, '../templates/emails');

/**
 * Read and process email template
 * @param {string} templateName - Template filename without extension
 * @param {object} data - Template variables
 * @returns {string} Processed HTML content
 */
function processTemplate(templateName, data) {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
  
  try {
    let html = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders with data
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, data[key]);
    });
    
    return html;
  } catch (error) {
    console.error(`Error reading template ${templateName}:`, error);
    return generateFallbackTemplate(templateName, data);
  }
}

/**
 * Generate fallback template if file not found
 */
function generateFallbackTemplate(templateName, data) {
  const companyName = data.companyName || 'RoofManager';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.subject || 'RoofManager Notification'}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">${companyName}</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2>${data.subject || 'Notification'}</h2>
        <p>${data.message || 'You have a new notification.'}</p>
        ${data.actionUrl ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.actionUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            ${data.actionText || 'View Details'}
          </a>
        </div>
        ` : ''}
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          If you have any questions, please contact us at ${process.env.EMAIL_USER}
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send an email
 * @param {object} options - Email options
 * @returns {Promise<object>} Send result
 */
async function sendEmail(options) {
  const {
    to,
    subject,
    html,
    text,
    templateName,
    templateData = {},
    replyTo,
  } = options;

  try {
    // Process template if provided
    const emailHtml = templateName ? processTemplate(templateName, {
      ...templateData,
      subject,
      companyName: templateData.companyName || 'RoofManager',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    }) : html;

    const emailText = text || emailHtml.replace(/<[^>]*>/g, '');

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'RoofManager <noreply@roofmanager.com>',
      to,
      subject,
      html: emailHtml,
      text: emailText,
    };

    if (replyTo) {
      mailOptions.replyTo = replyTo;
    }

    const result = await transporter.sendMail(mailOptions);
    
    console.log(`Email sent to ${to}: ${subject}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`Email send failed to ${to}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if email should be sent based on user preferences
 * @param {string} userId - User ID to check preferences for
 * @param {string} notificationType - Type of notification
 * @param {number} invoiceAmount - Optional invoice amount for threshold check
 * @returns {Promise<object>} { shouldSend: boolean, reason: string }
 */
async function shouldSendEmail(userId, notificationType, invoiceAmount = 0) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return { shouldSend: false, reason: 'User not found' };
    }

    if (!user.isActive) {
      return { shouldSend: false, reason: 'User inactive' };
    }

    // Parse email notifications settings
    const emailSettings = typeof user.emailNotifications === 'string'
      ? JSON.parse(user.emailNotifications)
      : user.emailNotifications || {};

    // Check if email notifications are enabled
    if (emailSettings.enabled === false) {
      return { shouldSend: false, reason: 'Email notifications disabled' };
    }

    // Check invoice threshold
    if (invoiceAmount > 0 && user.invoiceThreshold > 0 && invoiceAmount < user.invoiceThreshold) {
      return { shouldSend: false, reason: `Below invoice threshold (${user.invoiceThreshold})` };
    }

    // Check specific notification type
    const settingKey = notificationType.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (!emailSettings[settingKey] && settingKey !== 'general') {
      return { shouldSend: false, reason: `${notificationType} email disabled` };
    }

    return { shouldSend: true, reason: 'All checks passed' };
  } catch (error) {
    console.error('Error checking email preferences:', error);
    return { shouldSend: true, reason: 'Error checking preferences, sending anyway' };
  }
}

/**
 * Send quote notification email
 */
async function sendQuoteEmail(quote, customerEmail, company) {
  return sendEmail({
    to: customerEmail,
    subject: `Quote #${quote.quoteNumber} from ${company.name}`,
    templateName: 'quote-sent',
    templateData: {
      customerName: quote.customerName,
      companyName: company.name,
      companyLogo: company.logo,
      quoteNumber: quote.quoteNumber,
      quoteTotal: `$${(quote.totalAmount || 0).toLocaleString()}`,
      quoteDate: new Date().toLocaleDateString(),
      validUntil: new Date(quote.validUntil).toLocaleDateString(),
      actionUrl: `${process.env.FRONTEND_URL}/quotes/${quote.publicLink}`,
      actionText: 'View Quote',
    },
  });
}

/**
 * Send payment confirmation email
 */
async function sendPaymentConfirmationEmail(payment, invoice, customerEmail, company) {
  return sendEmail({
    to: customerEmail,
    subject: `Payment Received - Invoice #${invoice.invoiceNumber || invoice.id.slice(0, 8)}`,
    templateName: 'payment-confirmation',
    templateData: {
      customerName: invoice.customerName,
      companyName: company.name,
      paymentAmount: `$${(payment.amount || 0).toLocaleString()}`,
      paymentCurrency: payment.currency || 'USD',
      paymentDate: new Date().toLocaleDateString(),
      invoiceNumber: invoice.invoiceNumber || invoice.id.slice(0, 8),
      invoiceTotal: `$${(invoice.totalAmount || 0).toLocaleString()}`,
      amountPaid: `$${(invoice.paidAmount || 0).toLocaleString()}`,
      amountDue: `$${(invoice.totalAmount - (invoice.paidAmount || 0)).toLocaleString()}`,
    },
  });
}

/**
 * Send job scheduled notification email
 */
async function sendJobScheduledEmail(job, customerEmail, company) {
  return sendEmail({
    to: customerEmail,
    subject: `Job Scheduled - ${job.title}`,
    templateName: 'job-scheduled',
    templateData: {
      customerName: job.customerName,
      companyName: company.name,
      jobTitle: job.title,
      jobAddress: job.address,
      scheduledStart: new Date(job.scheduledStart).toLocaleDateString(),
      scheduledTime: job.scheduledStartTime || '9:00 AM',
      jobType: job.jobType || 'Roofing Service',
      actionUrl: `${process.env.FRONTEND_URL}/jobs/${job.id}`,
      actionText: 'View Job Details',
    },
  });
}

/**
 * Send invoice reminder email
 */
async function sendInvoiceReminderEmail(invoice, customerEmail, company) {
  const daysOverdue = Math.floor(
    (new Date() - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24)
  );

  return sendEmail({
    to: customerEmail,
    subject: daysOverdue > 0 
      ? `Invoice Overdue - ${invoice.invoiceNumber || invoice.id.slice(0, 8)}` 
      : `Invoice Reminder - ${invoice.invoiceNumber || invoice.id.slice(0, 8)}`,
    templateName: 'invoice-reminder',
    templateData: {
      customerName: invoice.customerName,
      companyName: company.name,
      invoiceNumber: invoice.invoiceNumber || invoice.id.slice(0, 8),
      invoiceAmount: `$${(invoice.totalAmount || 0).toLocaleString()}`,
      amountDue: `$${(invoice.totalAmount - (invoice.paidAmount || 0)).toLocaleString()}`,
      dueDate: new Date(invoice.dueDate).toLocaleDateString(),
      daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
      actionUrl: `${process.env.FRONTEND_URL}/invoices/${invoice.id}`,
      actionText: 'Pay Now',
    },
  });
}

/**
 * Send generic notification email
 */
async function sendNotificationEmail(to, subject, message, companyName = 'RoofManager') {
  return sendEmail({
    to,
    subject,
    templateName: 'notification',
    templateData: {
      companyName,
      subject,
      message,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
  });
}

/**
 * Verify email transporter configuration
 */
async function verifyConnection() {
  try {
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return { success: true };
  } catch (error) {
    console.error('Email server connection failed:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendEmail,
  sendQuoteEmail,
  sendPaymentConfirmationEmail,
  sendJobScheduledEmail,
  sendInvoiceReminderEmail,
  sendNotificationEmail,
  verifyConnection,
  transporter,
};
