/**
 * Settings Controller
 * Handles user and company settings
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Get notification preferences for current user
 * GET /api/settings/notifications
 */
async function getNotificationPreferences(req, res) {
  try {
    const userId = req.userId
    const companyId = req.companyId

    const user = await prisma.user.findFirst({
      where: { id: userId, companyId }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      })
    }

    // Parse JSON fields
    const emailNotifications = typeof user.emailNotifications === 'string' 
      ? JSON.parse(user.emailNotifications) 
      : user.emailNotifications || {}
    
    const smsNotifications = typeof user.smsNotifications === 'string'
      ? JSON.parse(user.smsNotifications)
      : user.smsNotifications || {}

    res.json({
      success: true,
      data: {
        emailEnabled: emailNotifications.enabled !== false,
        emailNewLead: emailNotifications.newLead !== false,
        emailNewQuote: emailNotifications.newQuote !== false,
        emailQuoteApproved: emailNotifications.quoteApproved !== false,
        emailNewInvoice: emailNotifications.newInvoice !== false,
        emailPaymentReceived: emailNotifications.paymentReceived !== false,
        emailJobAssigned: emailNotifications.jobAssigned !== false,
        emailJobCompleted: emailNotifications.jobCompleted !== false,
        smsEnabled: smsNotifications.enabled === true,
        smsNewLead: smsNotifications.newLead === true,
        smsQuoteApproved: smsNotifications.quoteApproved !== false,
        smsPaymentReceived: smsNotifications.paymentReceived !== false,
        smsJobAssigned: smsNotifications.jobAssigned !== false,
        smsUrgentAlerts: smsNotifications.urgentAlerts !== false,
        invoiceThreshold: user.invoiceThreshold || 0,
        quietHoursStart: user.quietHoursStart || '21:00',
        quietHoursEnd: user.quietHoursEnd || '07:00',
      }
    })
  } catch (error) {
    console.error('Get notification preferences error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch preferences' }
    })
  }
}

/**
 * Update notification preferences for current user
 * PUT /api/settings/notifications
 */
async function updateNotificationPreferences(req, res) {
  try {
    const userId = req.userId
    const companyId = req.companyId
    const {
      emailEnabled,
      emailNewLead,
      emailNewQuote,
      emailQuoteApproved,
      emailNewInvoice,
      emailPaymentReceived,
      emailJobAssigned,
      emailJobCompleted,
      smsEnabled,
      smsNewLead,
      smsQuoteApproved,
      smsPaymentReceived,
      smsJobAssigned,
      smsUrgentAlerts,
      invoiceThreshold,
      quietHoursStart,
      quietHoursEnd
    } = req.body

    const user = await prisma.user.findFirst({
      where: { id: userId, companyId }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      })
    }

    // Build notification config objects
    const emailNotifications = {
      enabled: emailEnabled,
      newLead: emailNewLead,
      newQuote: emailNewQuote,
      quoteApproved: emailQuoteApproved,
      newInvoice: emailNewInvoice,
      paymentReceived: emailPaymentReceived,
      jobAssigned: emailJobAssigned,
      jobCompleted: emailJobCompleted,
    }

    const smsNotifications = {
      enabled: smsEnabled,
      newLead: smsNewLead,
      quoteApproved: smsQuoteApproved,
      paymentReceived: smsPaymentReceived,
      jobAssigned: smsJobAssigned,
      urgentAlerts: smsUrgentAlerts,
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        emailNotifications: JSON.stringify(emailNotifications),
        smsNotifications: JSON.stringify(smsNotifications),
        invoiceThreshold: invoiceThreshold || 0,
        quietHoursStart: quietHoursStart || '21:00',
        quietHoursEnd: quietHoursEnd || '07:00',
      }
    })

    res.json({
      success: true,
      message: 'Notification preferences updated successfully'
    })
  } catch (error) {
    console.error('Update notification preferences error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update preferences' }
    })
  }
}

/**
 * Check if user should receive notification
 * Utility function for notification services
 */
async function shouldSendNotification(userId, type, amount = 0) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) return { send: false, reason: 'User not found' }

  // Check if user is active
  if (!user.isActive) return { send: false, reason: 'User inactive' }

  // Parse notification settings
  const emailSettings = typeof user.emailNotifications === 'string'
    ? JSON.parse(user.emailNotifications)
    : user.emailNotifications || {}
  
  const smsSettings = typeof user.smsNotifications === 'string'
    ? JSON.parse(user.smsNotifications)
    : user.smsNotifications || {}

  // Check invoice threshold
  if (amount > 0 && user.invoiceThreshold > 0 && amount < user.invoiceThreshold) {
    return { send: false, reason: 'Below invoice threshold' }
  }

  // Check if notification type is enabled
  if (type.startsWith('email') && !emailSettings.enabled) {
    return { send: false, reason: 'Email notifications disabled' }
  }

  if (type.startsWith('sms') && !smsSettings.enabled) {
    return { send: false, reason: 'SMS notifications disabled' }
  }

  // Check specific notification type
  const settingKey = type.replace(/^(email|sms)/, (match) => {
    return match.charAt(0).toLowerCase() + match.slice(1)
  })

  if (type.startsWith('email') && !emailSettings[settingKey]) {
    return { send: false, reason: `${settingKey} email disabled` }
  }

  if (type.startsWith('sms') && !smsSettings[settingKey]) {
    return { send: false, reason: `${settingKey} SMS disabled` }
  }

  // Check quiet hours for SMS
  if (type.startsWith('sms') && smsSettings.enabled) {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const quietStart = user.quietHoursStart || '21:00'
    const quietEnd = user.quietHoursEnd || '07:00'

    if (quietStart > quietEnd) {
      // Quiet hours cross midnight (e.g., 21:00 - 07:00)
      if (currentTime >= quietStart || currentTime < quietEnd) {
        return { send: false, reason: 'Quiet hours', queue: true }
      }
    } else {
      // Quiet hours within same day
      if (currentTime >= quietStart && currentTime < quietEnd) {
        return { send: false, reason: 'Quiet hours', queue: true }
      }
    }
  }

  return { send: true }
}

/**
 * Get all user settings
 * GET /api/settings
 */
async function getSettings(req, res) {
  try {
    const userId = req.userId
    const companyId = req.companyId

    const user = await prisma.user.findFirst({
      where: { id: userId, companyId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        company: {
          select: {
            name: true,
            logo: true,
            primaryColor: true,
            secondaryColor: true,
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      })
    }

    res.json({
      success: true,
      data: {
        user,
        notifications: await getNotificationPreferencesData(userId)
      }
    })
  } catch (error) {
    console.error('Get settings error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch settings' }
    })
  }
}

/**
 * Helper function to get notification preferences as object
 */
async function getNotificationPreferencesData(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) return null

  const emailNotifications = typeof user.emailNotifications === 'string' 
    ? JSON.parse(user.emailNotifications) 
    : user.emailNotifications || {}
  
  const smsNotifications = typeof user.smsNotifications === 'string'
    ? JSON.parse(user.smsNotifications)
    : user.smsNotifications || {}

  return {
    emailEnabled: emailNotifications.enabled !== false,
    smsEnabled: smsNotifications.enabled === true,
    invoiceThreshold: user.invoiceThreshold || 0,
    quietHoursStart: user.quietHoursStart || '21:00',
    quietHoursEnd: user.quietHoursEnd || '07:00',
  }
}

module.exports = {
  getNotificationPreferences,
  updateNotificationPreferences,
  getSettings,
  shouldSendNotification
}
