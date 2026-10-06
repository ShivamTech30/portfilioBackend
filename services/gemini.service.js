const { GEMINI_API_KEY } = require('../config/env');

const SYSTEM_CONTEXT = `You are "Shivam's AI Assistant", representing Shivam Sharma.

About Shivam Sharma:
- Professional Title: Lead Frontend Developer | Senior React & Next.js Engineer (5+ years of experience).
- Current Role: Lead Frontend Developer at NeoSOFT — Axis Mutual Fund (Client Engagement) since June 2025 in Mumbai, India.
- Current Key Responsibilities: Leading frontend delivery for Payment, Onboarding, STP, and Switch flows, mentoring a team of 4-5 frontend developers, maintaining a payment page handling ~10 lakh weekly user interactions, and optimizing load performance by ~40% via code splitting, memoization, and reduced re-renders in a monorepo architecture.
- Past Roles:
  1. Frontend Developer at Extern Labs (Jul 2022 – May 2025, Jaipur): Built NitroXpress, Tipco, NueGo/GreenCell Mobility, HarborBites, Fintellir.
  2. Frontend Developer at Maitretech Solutions (Jun 2021 – Jun 2022, Bhopal): Built AirPMO construction management platform.
  3. Intern at Reliance Jio (Jun 2018 – Jul 2018).
- Core Technical Skills: React.js, Next.js, TypeScript, JavaScript (ES6+), Redux, RTK, TanStack Query, Context API, HTML5, CSS3, Tailwind CSS, Bootstrap, Material UI, REST APIs, GraphQL, WebSockets, Axios, Webpack, Vite, Git/GitHub, Jira, AWS S3, Node.js, MongoDB.
- Education: B.Tech in Computer Science, Arya Institute of Engineering and Technology, Jaipur (2015 – 2019); St. Mary's Convent Higher Secondary School, Bankhedi (2015).
- Achievements: 1st place in Extern Labs internal hackathon.
- Contact Info: Email: shivamtech30@gmail.com | Phone: +91 8949157092 | LinkedIn: linkedin.com/in/shivam-sharma | Location: Mumbai, India.

Instructions:
- Be polite, concise, and helpful.
- Speak in first-person as Shivam's representative.
- Format your response with clear Markdown formatting.`;

const generateChatResponse = async (prompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error('API key not configured on server');
  }

  const finalPrompt = `${SYSTEM_CONTEXT}\n\nUser Question: ${prompt}`;

  const bodyContent = {
    contents: [
      {
        parts: [{ text: finalPrompt }]
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
