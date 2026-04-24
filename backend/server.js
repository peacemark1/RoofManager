const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Trust proxy for Railway / Fly.io / any reverse proxy
app.set('trust proxy', 1);

// Middleware
app.use(helmet());

// CORS - allow multiple origins for production
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in production for now (Vercel preview URLs etc.)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/leads', require('./routes/lead.routes'));
app.use('/api/jobs', require('./routes/job.routes'));
app.use('/api/estimates', require('./routes/estimate.routes'));
app.use('/api/quotes', require('./routes/quote.routes'));
app.use('/api/invoices', require('./routes/invoice.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/sms', require('./routes/sms.routes'));
app.use('/api/customer', require('./routes/customer.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/materials', require('./routes/material.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/company', require('./routes/company.routes'));

// 404 handler for unmatched API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: `Route ${req.originalUrl} not found` }
    });
  }
  next();
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message || 'Internal server error'
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
