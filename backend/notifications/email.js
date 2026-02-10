const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'apikey',
    pass: process.env.SMTP_PASS || process.env.SENDGRID_API_KEY
  }
});

async function sendEmail({ to, subject, html, text, attachments }) {
  try {
    const result = await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@roofmanager.com',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
      attachments
    });

    console.log(`Email sent to ${to}: ${subject}`);
    return result;
  } catch (error) {
    console.error('Email error:', error);
    // Don't throw - email failure shouldn't break the flow
    return null;
  }
}

async function sendQuoteEmail(quote, company, publicUrl) {
  const lineItems = typeof quote.lineItems === 'string' 
    ? JSON.parse(quote.lineItems) 
    : quote.lineItems;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: ${company.primaryColor || '#1e40af'}; color: white; padding: 30px; text-align: center; }
        .logo { max-width: 200px; max-height: 80px; margin-bottom: 10px; }
        .content { padding: 30px; }
        .quote-summary { background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .quote-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .total { font-size: 24px; font-weight: bold; color: ${company.primaryColor || '#1e40af'}; border-top: 2px solid #ddd; padding-top: 10px; margin-top: 10px; }
        .button { display: inline-block; padding: 15px 30px; background-color: ${company.primaryColor || '#1e40af'}; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; background-color: #f9fafb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${company.logo ? `<img src="${company.logo}" class="logo" alt="${company.name}" />` : `<h1>${company.name}</h1>`}
          <p>Roofing & Construction Services</p>
        </div>
        
        <div class="content">
          <h2>New Quote Ready for Review</h2>
          <p>Dear Customer,</p>
          <p>We have prepared a quote for your roofing project. Please review the details below:</p>
          
          <div class="quote-summary">
            <div class="quote-row">
              <span><strong>Quote #:</strong></span>
              <span>${quote.quoteNumber}</span>
            </div>
            <div class="quote-row">
              <span><strong>Date:</strong></span>
              <span>${new Date(quote.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="quote-row">
              <span><strong>Valid Until:</strong></span>
              <span>${new Date(quote.validUntil).toLocaleDateString()}</span>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
            ${lineItems.slice(0, 3).map(item => `
              <div class="quote-row">
                <span>${item.description}</span>
                <span>$${Number(item.total).toFixed(2)}</span>
              </div>
            `).join('')}
            ${lineItems.length > 3 ? `
              <div class="quote-row">
                <span>+ ${lineItems.length - 3} more items</span>
                <span></span>
              </div>
            ` : ''}
            <div class="quote-row total">
              <span>Total:</span>
              <span>$${Number(quote.total).toFixed(2)}</span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${publicUrl}" class="button">View & Sign Quote</a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If you have any questions about this quote, please don't hesitate to contact us.
          </p>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing ${company.name}!</p>
          <p>${company.name} | ${company.subdomain}.roofmanager.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: quote.job?.lead?.email || '',
    subject: `Quote #${quote.quoteNumber} from ${company.name}`,
    html
  });
}

async function sendQuoteApprovedEmail(quote, company) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #16a34a; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; text-align: center; }
        .checkmark { font-size: 60px; color: #16a34a; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Quote Approved!</h1>
        </div>
        <div class="content">
          <div class="checkmark">✓</div>
          <h2>Great News!</h2>
          <p>Quote #${quote.quoteNumber} has been approved and signed by the customer.</p>
          <p>You can now proceed with scheduling the job.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: company.users?.find(u => u.role === 'ADMIN')?.email || '',
    subject: `Quote #${quote.quoteNumber} Approved - ${company.name}`,
    html
  });
}

module.exports = { sendEmail, sendQuoteEmail, sendQuoteApprovedEmail };
