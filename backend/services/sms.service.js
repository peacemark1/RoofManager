/**
 * Hubtel SMS Service
 * Handles SMS notifications for Ghana-based communications
 */

const axios = require('axios');

const HUBTEL_CLIENT_ID = process.env.HUBTEL_CLIENT_ID;
const HUBTEL_CLIENT_SECRET = process.env.HUBTEL_CLIENT_SECRET;
const HUBTEL_SENDER_ID = process.env.HUBTEL_SENDER_ID || 'RoofManager';
const HUBTEL_API_URL = 'https://smsc.hubtel.com/v1/messages/send';
const HUBTEL_STATUS_URL = 'https://smsc.hubtel.com/v1/messages';

class HubtelSMSService {
  /**
   * Send SMS to a single recipient
   * @param {object} options - SMS options
   * @returns {Promise<object>} Send result
   */
  async sendSMS({ to, message }) {
    try {
      // Clean phone number (remove spaces, add Ghana code if needed)
      const cleanNumber = this.formatGhanaNumber(to);

      const response = await axios.get(HUBTEL_API_URL, {
        params: {
          clientsecret: HUBTEL_CLIENT_SECRET,
          clientid: HUBTEL_CLIENT_ID,
          from: HUBTEL_SENDER_ID,
          to: cleanNumber,
          content: message,
          type: 0 // 0 = Text, 1 = Flash, 2 = Unicode
        }
      });

      return {
        success: response.data.Status === 0,
        messageId: response.data.MessageId,
        networkId: response.data.NetworkId,
        cost: response.data.Rate,
        status: response.data.Status === 0 ? 'sent' : 'failed'
      };
    } catch (error) {
      console.error('Hubtel SMS error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'SMS sending failed'
      };
    }
  }

  /**
   * Format Ghana phone numbers to international format
   * @param {string} phone - Phone number
   * @returns {string} Formatted phone number
   */
  formatGhanaNumber(phone) {
    if (!phone) return null;

    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, replace with 233
    if (cleaned.startsWith('0')) {
      cleaned = '233' + cleaned.substring(1);
    }

    // If doesn't start with 233, add it
    if (!cleaned.startsWith('233')) {
      cleaned = '233' + cleaned;
    }

    // Validate length (Ghana numbers are 12 digits after 233)
    if (cleaned.length !== 12) {
      console.warn(`Phone number ${phone} may be invalid after formatting: ${cleaned}`);
    }

    return cleaned;
  }

  /**
   * Send bulk SMS to multiple recipients
   * @param {Array} recipients - Array of { phone, message }
   * @returns {Promise<Array>} Results for each recipient
   */
  async sendBulkSMS(recipients) {
    const results = [];
    
    for (const recipient of recipients) {
      const result = await this.sendSMS({
        to: recipient.phone,
        message: recipient.message
      });
      
      results.push({
        phone: recipient.phone,
        ...result
      });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  /**
   * Check delivery status of a message
   * @param {string} messageId - Hubtel message ID
   * @returns {Promise<object>} Delivery status
   */
  async checkDeliveryStatus(messageId) {
    try {
      const response = await axios.get(
        `${HUBTEL_STATUS_URL}/${messageId}`,
        {
          params: {
            clientsecret: HUBTEL_CLIENT_SECRET,
            clientid: HUBTEL_CLIENT_ID
          }
        }
      );

      return {
        success: true,
        status: response.data.Status,
        delivered: response.data.Status === 'DELIVERED',
        cost: response.data.Rate,
        updatedAt: response.data.UpdateTime
      };
    } catch (error) {
      console.error('Status check error:', error.response?.data);
      return {
        success: false,
        error: 'Failed to check delivery status'
      };
    }
  }

  /**
   * Get account balance
   * @returns {Promise<object>} Balance information
   */
  async getBalance() {
    try {
      const response = await axios.get(
        'https://unity.hubtel.com/v1/me/balances',
        {
          auth: {
            username: HUBTEL_CLIENT_ID,
            password: HUBTEL_CLIENT_SECRET
          }
        }
      );

      return {
        success: true,
        balance: response.data[0]?.Balance || 0,
        currency: 'GHS'
      };
    } catch (error) {
      console.error('Balance check error:', error.response?.data);
      return { success: false, error: 'Failed to check balance' };
    }
  }

  /**
   * Check if SMS should be sent based on user preferences
   * @param {string} userId - User ID to check preferences for
   * @param {string} notificationType - Type of notification
   * @param {number} invoiceAmount - Optional invoice amount for threshold check
   * @returns {Promise<object>} { shouldSend: boolean, reason: string, queue: boolean }
   */
  async shouldSendSMS(userId, notificationType, invoiceAmount = 0) {
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

      // Parse SMS notifications settings
      const smsSettings = typeof user.smsNotifications === 'string'
        ? JSON.parse(user.smsNotifications)
        : user.smsNotifications || {};

      // Check if SMS notifications are enabled
      if (!smsSettings.enabled) {
        return { shouldSend: false, reason: 'SMS notifications disabled' };
      }

      // Check invoice threshold
      if (invoiceAmount > 0 && user.invoiceThreshold > 0 && invoiceAmount < user.invoiceThreshold) {
        return { shouldSend: false, reason: `Below invoice threshold (${user.invoiceThreshold})` };
      }

      // Check specific notification type
      const settingKey = notificationType.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (!smsSettings[settingKey] && settingKey !== 'urgent_alerts') {
        return { shouldSend: false, reason: `${notificationType} SMS disabled` };
      }

      // Check quiet hours
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const quietStart = user.quietHoursStart || '21:00';
      const quietEnd = user.quietHoursEnd || '07:00';

      if (quietStart > quietEnd) {
        // Quiet hours cross midnight (e.g., 21:00 - 07:00)
        if (currentTime >= quietStart || currentTime < quietEnd) {
          return { shouldSend: false, reason: 'Quiet hours', queue: true };
        }
      } else {
        // Quiet hours within same day
        if (currentTime >= quietStart && currentTime < quietEnd) {
          return { shouldSend: false, reason: 'Quiet hours', queue: true };
        }
      }

      return { shouldSend: true, reason: 'All checks passed' };
    } catch (error) {
      console.error('Error checking SMS preferences:', error);
      return { shouldSend: true, reason: 'Error checking preferences, sending anyway' };
    }
  }

  // ==================== Notification Templates ====================

  /**
   * Send job assignment notification to crew member
   */
  async notifyCrewAssignment(crewMember, job) {
    const message = `New job assigned! ${job.customerName} at ${job.address}. ` +
      `Scheduled: ${new Date(job.startDate).toLocaleDateString()}. ` +
      `Check dashboard for details.`;

    return this.sendSMS({ to: crewMember.phone, message });
  }

  /**
   * Send payment confirmation to customer
   */
  async notifyPaymentReceived(customer, invoice, amount) {
    const message = `Payment received! GHS ${amount.toLocaleString()} ` +
      `for Invoice #${invoice.slice(0, 8)}. ` +
      `Thank you for your business! - RoofManager`;

    return this.sendSMS({ to: customer.phone, message });
  }

  /**
   * Send appointment reminder to customer
   */
  async sendAppointmentReminder(customer, job, companyName = 'RoofManager') {
    const appointmentDate = new Date(job.startDate).toLocaleDateString('en-GB');
    
    const message = `Reminder: Your roofing job is scheduled for ${appointmentDate}. ` +
      `Our team will arrive between 8:00 AM - 10:00 AM. ` +
      `Questions? Call us. - ${companyName}`;

    return this.sendSMS({ to: customer.phone, message });
  }

  /**
   * Send quote ready notification to customer
   */
  async notifyQuoteReady(customer, quote, companyName = 'RoofManager') {
    const message = `Your roofing quote is ready! ` +
      `Total: GHS ${(quote.totalAmount || 0).toLocaleString()}. ` +
      `View and approve: ${process.env.FRONTEND_URL}/quotes/${quote.publicLink} ` +
      `- ${companyName}`;

    return this.sendSMS({ to: customer.phone, message });
  }

  /**
   * Send job completion notification
   */
  async notifyJobComplete(customer, job, companyName = 'RoofManager') {
    const message = `Your roofing job at ${job.address} is complete! ` +
      `Thank you for trusting us with your project. ` +
      `We appreciate your business! - ${companyName}`;

    return this.sendSMS({ to: customer.phone, message });
  }

  /**
   * Send urgent job update
   */
  async sendUrgentUpdate(customer, job, message) {
    const fullMessage = `URGENT UPDATE: ${job.customerName} at ${job.address}. ` +
      `${message} - RoofManager`;

    return this.sendSMS({ to: customer.phone, message: fullMessage });
  }
}

module.exports = new HubtelSMSService();
