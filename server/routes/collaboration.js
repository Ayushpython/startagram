const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Collaboration = require('../models/Collaboration');
const Blueprint = require('../models/Blueprint');

const router = express.Router();

// @route   POST /api/collaboration
// @desc    Create a collaboration request
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { blueprintId, recipientId, collaborationType, message, terms } = req.body;

    if (!blueprintId || !recipientId || !collaborationType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const blueprint = await Blueprint.findById(blueprintId);
    if (!blueprint) {
      return res.status(404).json({ error: 'Blueprint not found' });
    }

    const collaboration = new Collaboration({
      blueprint: blueprintId,
      initiator: req.user.userId,
      recipient: recipientId,
      message: message || '',
      collaborationType,
      terms: terms || {}
    });

    await collaboration.save();

    res.status(201).json({
      message: 'Collaboration request sent',
      collaboration
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/collaboration/:id
// @desc    Get collaboration details
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id)
      .populate('blueprint', 'title description')
      .populate('initiator', 'firstName lastName avatar')
      .populate('recipient', 'firstName lastName avatar');

    if (!collaboration) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }

    if (collaboration.recipient.toString() !== req.user.userId && collaboration.initiator.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(collaboration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/collaboration?status=pending
// @desc    Get collaboration requests
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status = 'pending', role } = req.query;

    let filter = {
      $or: [
        { recipient: req.user.userId },
        { initiator: req.user.userId }
      ]
    };

    if (status) filter.status = status;

    const collaborations = await Collaboration.find(filter)
      .populate('blueprint', 'title')
      .populate('initiator', 'firstName lastName avatar')
      .populate('recipient', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    res.json(collaborations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/collaboration/:id/accept
// @desc    Accept collaboration request
// @access  Private
router.put('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }

    if (collaboration.recipient.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    collaboration.status = 'accepted';
    collaboration.acceptedAt = new Date();
    await collaboration.save();

    res.json({
      message: 'Collaboration accepted',
      collaboration
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/collaboration/:id/reject
// @desc    Reject collaboration request
// @access  Private
router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }

    if (collaboration.recipient.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    collaboration.status = 'rejected';
    collaboration.rejectedAt = new Date();
    collaboration.rejectionReason = reason || '';
    await collaboration.save();

    res.json({
      message: 'Collaboration rejected',
      collaboration
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
