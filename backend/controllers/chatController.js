const { processUserShoppingRequest } = require('../services/aiService');

/**
 * Controller: Handles /api/chat requests
 * Supports both text queries and Base64 uploaded images
 */
const handleChat = async (req, res) => {
  try {
    const { message, image, history } = req.body;

    if (!message && !image) {
      return res.status(400).json({
        error: 'Please provide either a message or an image.'
      });
    }

    // Process using AI service (with automatic fallback)
    const result = await processUserShoppingRequest(message, image, history);

    return res.json({
      success: true,
      reply: result.reply,
      products: result.products || [],
      isAiPowered: result.isAiPowered
    });
  } catch (error) {
    console.error('Chat controller error:', error.message);
    return res.status(500).json({
      error: 'Sorry, I encountered an issue processing your request. Please try again.'
    });
  }
};

module.exports = {
  handleChat
};
