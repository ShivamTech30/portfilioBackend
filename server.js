const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json()); // Parse incoming JSON requests

// Gemini API endpoint
app.post('/api/gemini', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    // The frontend sends the body exactly as Gemini expects it.
    // We proxy it to the Gemini API securely, keeping the API key on the backend.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': '*/*' 
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini API Error (${response.status}):`, errText);
      return res.status(response.status).json({ 
        error: `Gemini API error: ${response.status}`, 
        details: errText 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Server error while calling Gemini:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`Send POST requests to http://localhost:${PORT}/api/gemini`);
});
