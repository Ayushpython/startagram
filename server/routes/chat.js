const express = require('express');
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Create or get a direct conversation with another user
router.post('/conversation', async (req, res) => {
  try {
    const me = req.user.userId;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ error: 'recipientId is required' });
    }

    if (!isValidObjectId(me) || !isValidObjectId(recipientId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (me === recipientId) {
      return res.status(400).json({ error: 'Cannot create chat with same user' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [me, recipientId] },
      type: 'direct',
    }).populate('participants', 'username firstName lastName avatar');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [me, recipientId],
        type: 'direct',
      });
      conversation = await conversation.populate('participants', 'username firstName lastName avatar');
    }

    return res.json({ conversation });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// List conversations for current user
router.get('/conversation', async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const conversations = await Conversation.find({ participants: userId })
      .sort({ lastMessageAt: -1 })
      .populate('participants', 'username firstName lastName avatar');

    return res.json({ conversations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get messages for a conversation
router.get('/conversation/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const me = req.user.userId;

    if (!isValidObjectId(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID format' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const isMember = conversation.participants.some((id) => id.toString() === me);
    if (!isMember) {
      return res.status(403).json({ error: 'Unauthorized conversation access' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'username firstName lastName avatar')
      .populate('receiver', 'username firstName lastName avatar');

    return res.json({ messages });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Send message in conversation
router.post('/conversation/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user.userId;

    if (!isValidObjectId(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID format' });
    }

    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const participants = conversation.participants.map((id) => id.toString());
    if (!participants.includes(senderId)) {
      return res.status(403).json({ error: 'Unauthorized conversation access' });
    }

    const receiverId = participants.find((id) => id !== senderId);
    if (!receiverId) {
      return res.status(400).json({ error: 'Receiver not found for direct chat' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      receiver: receiverId,
      content,
    });

    conversation.lastMessageAt = new Date();
    conversation.lastMessagePreview = content.slice(0, 120);
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username firstName lastName avatar')
      .populate('receiver', 'username firstName lastName avatar');

    return res.status(201).json({ message: populatedMessage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
