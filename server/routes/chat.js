const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  createOrGetConversation,
  getConversations,
  getMessages,
  sendMessage,
} = require('../controllers/chatController');

const router = express.Router();

router.use(authMiddleware);

router.post('/conversation', createOrGetConversation);
router.get('/conversation', getConversations);
router.get('/conversation/:conversationId/messages', getMessages);
router.post('/conversation/:conversationId/messages', sendMessage);

module.exports = router;
