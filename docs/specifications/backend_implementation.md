# RoofManager Backend Implementation Guide

Node.js + Express + Prisma backend with AI integration.

---

## Project Setup

### Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.8.0",
    "@prisma/client": "^5.8.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "axios": "^1.6.5",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.2",
    "nodemailer": "^6.9.8",
    "twilio": "^4.20.0",
    "stripe": "^14.12.0",
    "puppeteer": "^21.9.0",
    "winston": "^3.11.0",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.0",
    "@types/express": "^4.17.21",
    "nodemon": "^3.0.3",
    "jest": "^29.7.0",
    "supertest": "^6.3.4"
  }
}
```

### Environment Variables (`.env`)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/roofmanager"

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Ollama AI
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen3-coder:30b

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (SendGrid)
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@roofmanager.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 1. Server Setup

### `backend/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/leads', require('./routes/lead.routes'));
app.use('/api/jobs', require('./routes/job.routes'));
app.use('/api/estimates', require('./routes/estimate.routes'));
app.use('/api/quotes', require('./routes/quote.routes'));
app.use('/api/invoices', require('./routes/invoice.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/materials', require('./routes/material.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/company', require('./routes/company.routes'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Internal server error'
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## 2. Authentication

### `backend/middleware/auth.middleware.js`

```javascript
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function authenticate(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No token provided' }
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { company: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid token' }
      });
    }

    // Attach user and company to request
    req.user = user;
    req.companyId = user.companyId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' }
    });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
```

### `backend/controllers/auth.controller.js`

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function register(req, res) {
  try {
    const { company, user } = req.body;

    // Check if subdomain is taken
    const existingCompany = await prisma.company.findUnique({
      where: { subdomain: company.subdomain }
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        error: { code: 'CONFLICT', message: 'Subdomain already taken' }
      });
    }

    // Check if email is taken
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'CONFLICT', message: 'Email already registered' }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create company and admin user in transaction
    const result = await prisma.$transaction(async (tx) => {
      const newCompany = await tx.company.create({
        data: {
          name: company.name,
          subdomain: company.subdomain
        }
      });

      const newUser = await tx.user.create({
        data: {
          email: user.email,
          password: hashedPassword,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: 'ADMIN',
          companyId: newCompany.id
        }
      });

      // Create free subscription
      await tx.subscription.create({
        data: {
          tier: 'FREE',
          status: 'ACTIVE',
          companyId: newCompany.id
        }
      });

      return { company: newCompany, user: newUser };
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: result.user.id,
        companyId: result.company.id,
        role: result.user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      data: {
        company: result.company,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Registration failed' }
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' }
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' }
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        companyId: user.companyId,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          companyId: user.companyId
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Login failed' }
    });
  }
}

module.exports = { register, login };
```

---

## 3. AI Integration (Ollama)

### `backend/ai/estimator.js`

```javascript
const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'qwen3-coder:30b';

async function generateEstimate(jobData) {
  try {
    const prompt = `You are an expert roofing estimator. Analyze the following job details and provide a detailed cost estimate in JSON format.

Job Details:
- Property Type: ${jobData.propertyType}
- Roof Size: ${jobData.roofSize} sq ft
- Roof Pitch: ${jobData.roofPitch || 'Not specified'}
- Description: ${jobData.description || 'None'}

Respond with ONLY valid JSON in this exact format:
{
  "laborHours": <number>,
  "materials": [
    {"name": "<material name>", "quantity": <number>, "unit": "<unit>", "estimatedCost": <number>}
  ],
  "totalCost": <number>,
  "timeline": "<estimated timeline>",
  "confidenceScore": <0-100>,
  "notes": "<any important notes or assumptions>"
}`;

    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 1000
      }
    });

    // Parse AI response
    const aiResponse = response.data.response;
    
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }

    const estimate = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!estimate.laborHours || !estimate.materials || !estimate.totalCost) {
      throw new Error('Invalid estimate structure from AI');
    }

    return {
      ...estimate,
      aiGenerated: true
    };
  } catch (error) {
    console.error('AI estimation error:', error);
    
    // Fallback to simple calculation
    return generateFallbackEstimate(jobData);
  }
}

function generateFallbackEstimate(jobData) {
  // Simple rule-based estimation
  const baseRate = 5.5; // $ per sq ft
  const totalCost = jobData.roofSize * baseRate;
  const laborCost = totalCost * 0.6;
  const laborHours = laborCost / 50; // $50/hour average

  return {
    laborHours: Math.ceil(laborHours),
    materials: [
      {
        name: 'Asphalt Shingles',
        quantity: Math.ceil(jobData.roofSize / 100),
        unit: 'bundle',
        estimatedCost: totalCost * 0.3
      },
      {
        name: 'Underlayment',
        quantity: jobData.roofSize,
        unit: 'sq ft',
        estimatedCost: totalCost * 0.05
      },
      {
        name: 'Misc Materials',
        quantity: 1,
        unit: 'lot',
        estimatedCost: totalCost * 0.05
      }
    ],
    totalCost: Math.ceil(totalCost),
    timeline: `${Math.ceil(laborHours / 8)} days`,
    confidenceScore: 50,
    notes: 'Fallback estimate based on industry averages. AI estimation unavailable.',
    aiGenerated: false
  };
}

module.exports = { generateEstimate };
```

### `backend/controllers/estimate.controller.js`

```javascript
const { PrismaClient } = require('@prisma/client');
const { generateEstimate } = require('../ai/estimator');
const prisma = new PrismaClient();

async function createEstimate(req, res) {
  try {
    const { jobId, useAI } = req.body;

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: jobId, companyId: req.companyId }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job not found' }
      });
    }

    let estimateData;

    if (useAI) {
      // Use AI to generate estimate
      estimateData = await generateEstimate({
        propertyType: job.propertyType,
        roofSize: job.roofSize,
        roofPitch: job.roofPitch,
        description: job.description
      });
    } else {
      // Manual estimate
      estimateData = req.body;
    }

    // Create estimate in database
    const estimate = await prisma.estimate.create({
      data: {
        jobId,
        companyId: req.companyId,
        createdBy: req.user.id,
        laborHours: estimateData.laborHours,
        totalCost: estimateData.totalCost,
        timeline: estimateData.timeline,
        aiGenerated: estimateData.aiGenerated || false,
        aiConfidence: estimateData.confidenceScore,
        notes: estimateData.notes,
        materials: {
          create: estimateData.materials.map(m => ({
            name: m.name,
            quantity: m.quantity,
            unit: m.unit,
            estimatedCost: m.estimatedCost
          }))
        }
      },
      include: {
        materials: true
      }
    });

    res.status(201).json({
      success: true,
      data: estimate
    });
  } catch (error) {
    console.error('Create estimate error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create estimate' }
    });
  }
}

module.exports = { createEstimate };
```

---

## 4. Payment Integration (Stripe)

### `backend/integrations/stripe.js`

```javascript
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(invoice, successUrl, cancelUrl) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: invoice.lineItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.description
          },
          unit_amount: Math.round(item.total * 100) // Convert to cents
        },
        quantity: 1
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        invoiceId: invoice.id
      }
    });

    return session;
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
}

async function handleWebhook(event) {
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handlePaymentSuccess(session);
      break;
      
    case 'payment_intent.payment_failed':
      const intent = event.data.object;
      await handlePaymentFailed(intent);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handlePaymentSuccess(session) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  const invoiceId = session.metadata.invoiceId;
  const amount = session.amount_total / 100;

  await prisma.payment.create({
    data: {
      invoiceId,
      amount,
      method: 'CREDIT_CARD',
      stripePaymentId: session.payment_intent,
      status: 'COMPLETED',
      paidAt: new Date()
    }
  });

  // Update invoice
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      amountPaid: { increment: amount },
      status: 'PAID'
    }
  });
}

module.exports = { createCheckoutSession, handleWebhook };
```

---

## 5. Notifications

### `backend/notifications/email.js`

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html
    });

    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

async function sendQuoteEmail(quote, customerEmail) {
  const html = `
    <h1>New Quote from ${quote.company.name}</h1>
    <p>You have received a new quote for ${quote.job.title}</p>
    <p><strong>Total:</strong> $${quote.total.toFixed(2)}</p>
    <p><a href="${process.env.FRONTEND_URL}/quotes/${quote.publicLink}">View Quote</a></p>
  `;

  await sendEmail({
    to: customerEmail,
    subject: `Quote #${quote.quoteNumber} from ${quote.company.name}`,
    html
  });
}

module.exports = { sendEmail, sendQuoteEmail };
```

---

## 6. PDF Generation

### `backend/quotes/generator.js`

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function generateQuotePDF(quote) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();

    // HTML template for quote
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { max-width: 200px; }
          .quote-info { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #1e40af; color: white; }
          .total { font-size: 24px; font-weight: bold; text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${quote.company.logo}" class="logo" />
          <h1>Quote #${quote.quoteNumber}</h1>
        </div>
        
        <div class="quote-info">
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Valid Until:</strong> ${new Date(quote.validUntil).toLocaleDateString()}</p>
          <p><strong>Job:</strong> ${quote.job.title}</p>
          <p><strong>Address:</strong> ${quote.job.address}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${quote.lineItems.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${item.unitPrice.toFixed(2)}</td>
                <td>$${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total">
          <p>Subtotal: $${quote.subtotal.toFixed(2)}</p>
          <p>Tax: $${quote.tax.toFixed(2)}</p>
          <p>Total: $${quote.total.toFixed(2)}</p>
        </div>
        
        <p>${quote.notes || ''}</p>
        <p><small>${quote.termsAndConditions || ''}</small></p>
      </body>
      </html>
    `;

    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4' });

    const filename = `quote-${quote.quoteNumber}.pdf`;
    const filepath = path.join(__dirname, '../uploads/quotes', filename);

    await fs.writeFile(filepath, pdfBuffer);

    return filepath;
  } finally {
    await browser.close();
  }
}

module.exports = { generateQuotePDF };
```

---

## 7. Multi-Tenant Middleware

### `backend/middleware/tenant.middleware.js`

```javascript
function enforceCompanyScope(req, res, next) {
  // This middleware ensures all queries are scoped to the user's company
  // Prisma middleware handles this automatically via companyId
  
  if (!req.companyId) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Company context required' }
    });
  }
  
  next();
}

module.exports = { enforceCompanyScope };
```

### Prisma Middleware (in `server.js`)

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Auto-inject companyId in queries
prisma.$use(async (params, next) => {
  // Only apply to models with companyId
  const modelsWithCompanyId = ['Lead', 'Job', 'Estimate', 'Quote', 'Invoice', 'Material', 'Notification'];
  
  if (modelsWithCompanyId.includes(params.model)) {
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = {
        ...params.args.where,
        companyId: req.companyId // Injected from middleware
      };
    }
  }
  
  return next(params);
});
```

---

## Complete File List for Kilo Code

**Backend Files to Create:**
1. `backend/server.js`
2. `backend/middleware/auth.middleware.js`
3. `backend/middleware/tenant.middleware.js`
4. `backend/controllers/auth.controller.js`
5. `backend/controllers/lead.controller.js`
6. `backend/controllers/job.controller.js`
7. `backend/controllers/estimate.controller.js`
8. `backend/controllers/quote.controller.js`
9. `backend/controllers/invoice.controller.js`
10. `backend/routes/auth.routes.js`
11. `backend/routes/lead.routes.js`
12. `backend/routes/job.routes.js`
13. `backend/ai/estimator.js`
14. `backend/integrations/stripe.js`
15. `backend/notifications/email.js`
16. `backend/notifications/sms.js`
17. `backend/quotes/generator.js`
18. `prisma/schema.prisma`
19. `.env`
20. `package.json`
