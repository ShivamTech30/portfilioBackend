const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json()); // Parse incoming JSON requests

// API Routes
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Backend API is running.');
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
