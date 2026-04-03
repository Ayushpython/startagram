const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/users/search?q=term
// @desc    Search users by username, first or last name
// @access  Private
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();

    if (!q) {
      return res.json({ users: [] });
    }

    const regex = new RegExp(q, 'i');
    const users = await User.find({
      _id: { $ne: req.user.userId },
      $or: [
        { username: regex },
        { firstName: regex },
        { lastName: regex },
        { email: regex },
      ],
    })
      .select('username firstName lastName email avatar')
      .limit(20);

    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('savedBlueprints', 'title category pricing')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/users
// @desc    Get current user profile
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('savedBlueprints', 'title category pricing')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.params.id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updateFields = ['firstName', 'lastName', 'bio', 'avatar', 'role', 'expertise', 'companyName', 'website', 'preferences'];
    const updates = {};

    updateFields.forEach(field => {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/users/:id/ratings
// @desc    Get user ratings and reviews
// @access  Public
router.get('/:id/ratings', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      rating: user.metrics.rating,
      totalRatings: user.metrics.totalRatings,
      metrics: user.metrics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/users/:id/save-blueprint
// @desc    Save blueprint to user's library
// @access  Private
router.post('/:id/save-blueprint', authMiddleware, async (req, res) => {
  try {
    const { blueprintId } = req.body;

    if (req.params.id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user.savedBlueprints.includes(blueprintId)) {
      user.savedBlueprints.push(blueprintId);
      await user.save();
    }

    res.json({ message: 'Blueprint saved', savedBlueprints: user.savedBlueprints });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/users/:id/unsave-blueprint/:blueprintId
// @desc    Remove blueprint from user's saved list
// @access  Private
router.delete('/:id/unsave-blueprint/:blueprintId', authMiddleware, async (req, res) => {
  try {
    if (req.params.id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.params.id);
    user.savedBlueprints = user.savedBlueprints.filter(bp => bp.toString() !== req.params.blueprintId);
    await user.save();

    res.json({ message: 'Blueprint removed from saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
