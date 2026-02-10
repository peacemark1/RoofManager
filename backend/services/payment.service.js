/**
 * Unified Payment Service
 * Handles both Paystack and Stripe payment gateways
 */

const paystackApi = require('paystack-api');
const Stripe = require('stripe');

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2023-10-16'
});

// Initialize Paystack
const paystack = paystackApi(process.env.PAYSTACK_SECRET_KEY || 'sk_test_dummy');

// African countries that use Paystack
const PAYSTACK_COUNTRIES = ['GH', 'NG', 'ZA', 'KE'];

/**
 * Detect the appropriate payment provider based on country
 * @param {string} country - ISO 2-letter country code
 * @returns {string} 'paystack' or 'stripe'
 */
function detectPaymentProvider(country) {
  if (country && PAYSTACK_COUNTRIES.includes(country.toUpperCase())) {
    return 'paystack';
  }
  return 'stripe';
}

/**
 * Initialize a payment session
 * @param {string} provider - 'paystack' or 'stripe'
 * @param {number} amount - Amount in smallest currency unit (e.g., cents for USD, pesewas for GHS)
 * @param {string} email - Customer email
 * @param {object} metadata - Additional metadata
 * @returns {Promise<object>} Payment initialization result
 */
async function initializePayment(provider, amount, email, metadata = {}) {
  try {
    if (provider === 'paystack') {
      return await initializePaystackPayment(amount, email, metadata);
    } else {
      return await initializeStripePayment(amount, email, metadata);
    }
  } catch (error) {
    console.error(`Error initializing ${provider} payment:`, error);
    return {
      success: false,
      error: error.message || `Failed to initialize ${provider} payment`
    };
  }
}

/**
 * Initialize Paystack payment
 */
async function initializePaystackPayment(amount, email, metadata) {
  try {
    // Paystack expects amount in pesewas (GHS cents) or kobo (NGN kobo)
    // We'll accept the amount as-is but ensure it's in the smallest unit
    const response = await paystack.transaction.initialize({
      email,
      amount: Math.round(amount),
      currency: metadata.currency || 'GHS',
      reference: metadata.reference,
      callback_url: metadata.callbackUrl || `${process.env.FRONTEND_URL}/payments/callback`,
      metadata: {
        ...metadata,
        service: 'roofmanager'
      }
    });

    if (response.status && response.data) {
      return {
        success: true,
        provider: 'paystack',
        authorizationUrl: response.data.authorization_url,
        accessCode: response.data.access_code,
        reference: response.data.reference
      };
    }

    return {
      success: false,
      error: response.message || 'Paystack initialization failed'
    };
  } catch (error) {
    console.error('Paystack initialization error:', error);
    return {
      success: false,
      error: error.message || 'Paystack payment initialization failed'
    };
  }
}

/**
 * Initialize Stripe payment
 */
async function initializeStripePayment(amount, email, metadata) {
  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: metadata.currency || 'usd',
      receipt_email: email,
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        ...metadata,
        service: 'roofmanager'
      },
      // Optionally specify a return URL for redirect-based payments
      return_url: metadata.callbackUrl || `${process.env.FRONTEND_URL}/payments/callback`
    });

    return {
      success: true,
      provider: 'stripe',
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Stripe initialization error:', error);
    return {
      success: false,
      error: error.message || 'Stripe payment initialization failed'
    };
  }
}

/**
 * Verify a payment transaction
 * @param {string} provider - 'paystack' or 'stripe'
 * @param {string} reference - Payment reference/ID
 * @returns {Promise<object>} Verification result
 */
async function verifyPayment(provider, reference) {
  try {
    if (provider === 'paystack') {
      return await verifyPaystackPayment(reference);
    } else {
      return await verifyStripePayment(reference);
    }
  } catch (error) {
    console.error(`Error verifying ${provider} payment:`, error);
    return {
      success: false,
      error: error.message || `Failed to verify ${provider} payment`
    };
  }
}

/**
 * Verify Paystack payment
 */
async function verifyPaystackPayment(reference) {
  try {
    const response = await paystack.transaction.verify(reference);

    if (response.status && response.data) {
      const transaction = response.data;
      const isSuccess = transaction.status === 'success';

      return {
        success: isSuccess,
        provider: 'paystack',
        reference: transaction.reference,
        amount: transaction.amount / 100, // Convert from pesewas to GHS
        currency: transaction.currency,
        paidAt: transaction.paid_at,
        channel: transaction.channel, // card, bank, mobile_money, ussd, etc.
        customer: {
          email: transaction.customer.email,
          name: `${transaction.customer.first_name || ''} ${transaction.customer.last_name || ''}`.trim()
        },
        status: transaction.status
      };
    }

    return {
      success: false,
      provider: 'paystack',
      error: response.message || 'Paystack verification failed'
    };
  } catch (error) {
    console.error('Paystack verification error:', error);
    return {
      success: false,
      provider: 'paystack',
      error: error.message || 'Paystack payment verification failed'
    };
  }
}

/**
 * Verify Stripe payment
 */
async function verifyStripePayment(paymentIntentId) {
  try {
    // Try to retrieve by PaymentIntent ID first
    let paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent) {
      const isSuccess = paymentIntent.status === 'succeeded';

      return {
        success: isSuccess,
        provider: 'stripe',
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        paidAt: new Date(paymentIntent.created * 1000).toISOString(),
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret
      };
    }

    return {
      success: false,
      provider: 'stripe',
      error: 'Stripe payment not found'
    };
  } catch (error) {
    // If PaymentIntent not found, try to find by charge ID or receipt email
    console.error('Stripe verification error:', error);
    return {
      success: false,
      provider: 'stripe',
      error: error.message || 'Stripe payment verification failed'
    };
  }
}

/**
 * Process a refund
 * @param {string} provider - 'paystack' or 'stripe'
 * @param {string} reference - Original payment reference/ID
 * @param {number} amount - Amount to refund (optional, defaults to full amount)
 * @returns {Promise<object>} Refund result
 */
async function processRefund(provider, reference, amount = null) {
  try {
    if (provider === 'paystack') {
      return await processPaystackRefund(reference, amount);
    } else {
      return await processStripeRefund(reference, amount);
    }
  } catch (error) {
    console.error(`Error processing ${provider} refund:`, error);
    return {
      success: false,
      error: error.message || `Failed to process ${provider} refund`
    };
  }
}

/**
 * Process Paystack refund
 */
async function processPaystackRefund(reference, amount = null) {
  try {
    const refundData = {
      transaction: reference
    };

    // Only include amount for partial refunds
    if (amount !== null) {
      refundData.amount = Math.round(amount * 100); // Convert to pesewas
    }

    const response = await paystack.refund.create(refundData);

    if (response.status && response.data) {
      return {
        success: true,
        provider: 'paystack',
        refundId: response.data.id,
        reference: response.data.transaction,
        amount: response.data.amount / 100, // Convert from pesewas
        status: response.data.status
      };
    }

    return {
      success: false,
      provider: 'paystack',
      error: response.message || 'Paystack refund failed'
    };
  } catch (error) {
    console.error('Paystack refund error:', error);
    return {
      success: false,
      provider: 'paystack',
      error: error.message || 'Paystack refund processing failed'
    };
  }
}

/**
 * Process Stripe refund
 */
async function processStripeRefund(reference, amount = null) {
  try {
    const refundData = {
      payment_intent: reference
    };

    // Only include amount for partial refunds
    if (amount !== null) {
      refundData.amount = Math.round(amount * 100); // Convert to cents
    }

    const refund = await stripe.refunds.create(refundData);

    return {
      success: true,
      provider: 'stripe',
      refundId: refund.id,
      paymentIntentId: refund.payment_intent,
      amount: refund.amount / 100, // Convert from cents
      status: refund.status
    };
  } catch (error) {
    console.error('Stripe refund error:', error);
    return {
      success: false,
      provider: 'stripe',
      error: error.message || 'Stripe refund processing failed'
    };
  }
}

/**
 * Handle Stripe webhook events
 * @param {object} payload - Webhook payload
 * @param {string} signature - Webhook signature for verification
 * @returns {object} Parsed event
 */
async function handleStripeWebhook(payload, signature) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    return {
      success: true,
      type: event.type,
      data: event.data.object
    };
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return {
      success: false,
      error: error.message || 'Invalid webhook signature'
    };
  }
}

/**
 * Handle Paystack webhook events
 * @param {object} payload - Webhook payload
 * @param {string} signature - Webhook signature for verification
 * @returns {object} Parsed event
 */
function handlePaystackWebhook(payload, signature) {
  try {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET || '')
      .update(JSON.stringify(payload))
      .digest('hex');

    if (hash !== signature) {
      return {
        success: false,
        error: 'Invalid webhook signature'
      };
    }

    return {
      success: true,
      type: payload.event,
      data: payload.data
    };
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return {
      success: false,
      error: error.message || 'Webhook processing failed'
    };
  }
}

module.exports = {
  detectPaymentProvider,
  initializePayment,
  verifyPayment,
  processRefund,
  handleStripeWebhook,
  handlePaystackWebhook
};
