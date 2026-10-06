const { GEMINI_API_KEY } = require('../config/env');

const generateChatResponse = async (prompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error('API key not configured on server');
  }

  const bodyContent = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': '*/*' 
      },
      body: JSON.stringify(bodyContent),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error(`Gemini API Error (${response.status}):`, errText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error('Unexpected response format from Gemini');
  }

  return text;
};

module.exports = {
  generateChatResponse
};
