const emailService = require('../services/email.service');

async function sendQuoteEmail(quote, company, recipientEmail) {
  try {
    if (!recipientEmail) return { success: false, error: 'No recipient email' };
    await emailService.sendEmail({
      to: recipientEmail,
      subject: `Quote ${quote.quoteNumber} from ${company.name}`,
      html: `<p>You have received a new quote. View it here: ${process.env.FRONTEND_URL}/quote/${quote.publicLink}</p>`
    });
    return { success: true };
  } catch (error) {
    console.error('Send quote email error:', error);
    return { success: false, error: error.message };
  }
}

async function sendQuoteApprovedEmail(quote, company) {
  try {
    const adminEmail = company.email;
    if (!adminEmail) return { success: false, error: 'No admin email' };
    await emailService.sendEmail({
      to: adminEmail,
      subject: `Quote ${quote.quoteNumber} Approved`,
      html: `<p>Quote ${quote.quoteNumber} has been approved by the customer.</p>`
    });
    return { success: true };
  } catch (error) {
    console.error('Send quote approved email error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendQuoteEmail, sendQuoteApprovedEmail };
