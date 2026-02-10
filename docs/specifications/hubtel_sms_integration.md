# Hubtel SMS Integration Guide (Ghana)

Complete guide for integrating Hubtel SMS API for Ghana-based notifications.

---

## Why Hubtel for Ghana?

- **Local Provider**: Based in Accra, Ghana
- **Best Rates**: GHS 0.035 per SMS (cheaper than Twilio)
- **All Networks**: MTN, Vodafone, AirtelTigo coverage
- **Delivery Reports**: Real-time delivery tracking
- **No Monthly Fees**: Pay-as-you-go

---

## Setup

### 1. Sign Up
1. Go to https://unity.hubtel.com/account/signup
2. Complete registration with Ghana Mobile Money or Bank Card
3. Verify your account
4. Load credit (minimum GHS 10)

### 2. Get API Credentials
1. Login to Unity Dashboard
2. Navigate to **Settings → API Keys**
3. Copy your **Client ID** and **Client Secret**

### 3. Register Sender ID
1. Go to **Messaging → Sender IDs**
2. Request "RoofManager" as sender ID (approval takes 24 hours)
3. While waiting, you can use "Hubtel" or your phone number

---

## Backend Implementation

### SMS Service (`backend/services/sms.service.js`)

```javascript
const axios = require('axios');

const HUBTEL_CLIENT_ID = process.env.HUBTEL_CLIENT_ID;
const HUBTEL_CLIENT_SECRET = process.env.HUBTEL_CLIENT_SECRET;
const HUBTEL_SENDER_ID = process.env.HUBTEL_SENDER_ID || 'RoofManager';
const HUBTEL_API_URL = 'https://smsc.hubtel.com/v1/messages/send';

class HubtelSMSService {
  // Send SMS
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
        cost: response.data.Rate
      };
    } catch (error) {
      console.error('Hubtel SMS error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'SMS sending failed'
      };
    }
  }

  // Format Ghana phone numbers
  formatGhanaNumber(phone) {
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

    return cleaned;
  }

  // Send bulk SMS
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

  // Check delivery status
  async checkDeliveryStatus(messageId) {
    try {
      const response = await axios.get(
        `https://smsc.hubtel.com/v1/messages/${messageId}`,
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

  // Get account balance
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
        balance: response.data[0].Balance,
        currency: 'GHS'
      };
    } catch (error) {
      console.error('Balance check error:', error.response?.data);
      return { success: false, error: 'Failed to check balance' };
    }
  }
}

module.exports = new HubtelSMSService();
```

---

### SMS Controller (`backend/controllers/sms.controller.js`)

```javascript
const smsService = require('../services/sms.service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Send job assignment notification to crew
async function notifyJobAssignment(req, res) {
  try {
    const { jobId, crewMemberId } = req.body;
    const companyId = req.companyId;

    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
      include: { crew: true }
    });

    const crewMember = await prisma.user.findFirst({
      where: { id: crewMemberId, companyId }
    });

    if (!job || !crewMember || !crewMember.phone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid job or crew member' }
      });
    }

    const message = `New job assigned! ${job.customerName} at ${job.address}. ` +
      `Scheduled: ${new Date(job.startDate).toLocaleDateString()}. ` +
      `Check dashboard for details.`;

    const result = await smsService.sendSMS({
      to: crewMember.phone,
      message
    });

    // Log SMS in database
    await prisma.notification.create({
      data: {
        companyId,
        userId: crewMemberId,
        type: 'sms',
        channel: 'hubtel',
        subject: 'Job Assignment',
        content: message,
        status: result.success ? 'sent' : 'failed',
        metadata: {
          messageId: result.messageId,
          cost: result.cost
        }
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

// Send payment confirmation to customer
async function notifyPaymentReceived(req, res) {
  try {
    const { invoiceId } = req.body;
    const companyId = req.companyId;

    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, companyId }
    });

    if (!invoice || !invoice.customerPhone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid invoice or missing phone' }
      });
    }

    const message = `Payment received! GHS ${invoice.totalAmount.toLocaleString()} ` +
      `for Invoice #${invoice.id.slice(0, 8)}. ` +
      `Thank you for your business! - RoofManager`;

    const result = await smsService.sendSMS({
      to: invoice.customerPhone,
      message
    });

    await prisma.notification.create({
      data: {
        companyId,
        type: 'sms',
        channel: 'hubtel',
        subject: 'Payment Confirmation',
        content: message,
        status: result.success ? 'sent' : 'failed',
        metadata: {
          messageId: result.messageId,
          invoiceId
        }
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

// Send appointment reminder
async function sendAppointmentReminder(req, res) {
  try {
    const { jobId } = req.body;
    const companyId = req.companyId;

    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId }
    });

    if (!job || !job.customerPhone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid job or missing phone' }
      });
    }

    const appointmentDate = new Date(job.startDate).toLocaleDateString('en-GB');

    const message = `Reminder: Your roofing job is scheduled for ${appointmentDate}. ` +
      `Our team will arrive between 8:00 AM - 10:00 AM. ` +
      `Questions? Call us. - RoofManager`;

    const result = await smsService.sendSMS({
      to: job.customerPhone,
      message
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

// Check SMS balance
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

module.exports = {
  notifyJobAssignment,
  notifyPaymentReceived,
  sendAppointmentReminder,
  checkBalance
};
```

---

## SMS Templates (Ghana Context)

### Job Assignment (to Crew)
```
New job assigned! [Customer Name] at [Address]. 
Scheduled: [Date]. 
Materials: [List]. 
Check dashboard for full details.
```

### Appointment Reminder (to Customer)
```
Reminder: Your roofing job is tomorrow at [Time]. 
Our team will call 30 mins before arrival. 
Weather permitting. - [Company Name]
```

### Payment Confirmation (to Customer)
```
Payment received! GHS [Amount] for Invoice #[ID]. 
Receipt sent to your email.
Thank you! - [Company Name]
```

### Quote Ready (to Customer)
```
Your roofing quote is ready! 
Total: GHS [Amount]. 
View and approve: [Link]
Valid for 30 days. - [Company Name]
```

---

## Automated SMS Triggers

Add these to your backend controllers:

```javascript
// After payment verification (payment.controller.js)
await smsService.sendSMS({
  to: invoice.customerPhone,
  message: `Payment confirmed! GHS ${amount}. Invoice #${invoiceId.slice(0,8)}. Thank you!`
});

// After job assignment (job.controller.js)
await smsService.sendSMS({
  to: crewMember.phone,
  message: `Job assigned: ${job.customerName}, ${job.address}. Date: ${startDate}.`
});

// 1 day before job (use a cron job)
const tomorrow = jobs.filter(j => isWithin24Hours(j.startDate));
for (const job of tomorrow) {
  await smsService.sendSMS({
    to: job.customerPhone,
    message: `Reminder: Roofing work tomorrow at ${formatTime(job.startDate)}. See you soon!`
  });
}
```

---

## Cost Management

### SMS Pricing (Hubtel Ghana)
- **Local SMS**: GHS 0.035 per SMS (160 characters)
- **Long SMS**: Multiple credits (every 160 chars = 1 credit)
- **Delivery Reports**: Free

### Best Practices:
1. Keep messages under 160 characters
2. Use abbreviations where appropriate
3. Batch messages during off-peak hours for better delivery
4. Check balance before sending bulk SMS
5. Monitor delivery reports to catch failures

### Sample Monthly Costs:
- 50 jobs/month × 3 SMS/job (assignment + reminder + completion) = 150 SMS
- 150 × GHS 0.035 = **GHS 5.25/month**

Very affordable! 🎉

---

## Testing

### Test Numbers
Hubtel provides test credentials in sandbox mode.

### Production Checklist
1. ✅ Register your Sender ID
2. ✅ Load at least GHS 20 credit
3. ✅ Test with your own phone first
4. ✅ Set up low balance alerts (in Hubtel dashboard)
5. ✅ Enable delivery reports
6. ✅ Monitor first week closely

---

## Support
- **Hubtel Ghana Support**: +233 30 281 0100
- **WhatsApp**: +233 59 156 5656
- **Email**: support@hubtel.com
- **Developer Docs**: https://developers.hubtel.com/documentations/sms-api
