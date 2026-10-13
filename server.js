const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { PORT, ALLOWED_ORIGIN } = require('./config/env');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// Parse allowed origins from environment variable
const allowedOrigins = (ALLOWED_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const isDev = process.env.NODE_ENV !== 'production';

// CORS configuration: restrict to ALLOWED_ORIGIN, permit localhost in development
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (curl, mobile, test scripts) where origin is undefined
    if (!origin) return callback(null, true);

    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (isDev && isLocalhost) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Rate limiter: 20 requests per minute per IP for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in a minute.'
  }
});

// API Routes with rate limiting
app.use('/api/ai', aiLimiter, aiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Backend API is running.');
});

// Error handling middleware (e.g. for CORS rejections)
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy does not allow access from this origin'
    });
  }
  console.error('Unhandled server error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start the server (Only in local development, Vercel handles this in production)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
    console.log(`Send POST requests to http://localhost:${PORT}/api/ai/chat`);
  });
}

// Export the app for Vercel Serverless Function
module.exports = app;
