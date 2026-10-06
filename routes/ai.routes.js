const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// POST /api/ai/chat
router.post('/chat', aiController.chat);

// POST /api/ai/prompt
router.post('/prompt', aiController.promptOnly);

module.exports = router;
