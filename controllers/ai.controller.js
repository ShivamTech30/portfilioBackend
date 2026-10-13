const geminiService = require('../services/gemini.service');

const MAX_PROMPT_LENGTH = 500;

const chat = async (req, res) => {
  try {
    const { prompt, history } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Prompt exceeds maximum allowed length of ${MAX_PROMPT_LENGTH} characters. Your prompt was ${prompt.length} characters.`
      });
    }

    // Validate and trim history to max 8 items of { role, text }
    let validatedHistory = [];
    if (Array.isArray(history)) {
      validatedHistory = history
        .slice(-8)
        .filter(item => item && typeof item === 'object')
        .map(item => ({
          role: typeof item.role === 'string' ? item.role : 'user',
          text: typeof item.text === 'string' ? item.text : (typeof item.content === 'string' ? item.content : '')
        }))
        .filter(item => item.text.trim().length > 0);
    }

    const responseText = await geminiService.generateChatResponse(prompt, validatedHistory);

    return res.status(200).json({
      success: true,
      prompt: prompt,
      response: responseText
    });
  } catch (error) {
    console.error('Error in chat controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI response'
    });
  }
};

const promptOnly = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Prompt exceeds maximum allowed length of ${MAX_PROMPT_LENGTH} characters. Your prompt was ${prompt.length} characters.`
      });
    }

    return res.status(200).json({
      success: true,
      prompt: prompt
    });
  } catch (error) {
    console.error('Error in prompt controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  chat,
  promptOnly
};
