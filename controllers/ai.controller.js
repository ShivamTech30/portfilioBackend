const geminiService = require('../services/gemini.service');

const chat = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    const responseText = await geminiService.generateChatResponse(prompt);

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
