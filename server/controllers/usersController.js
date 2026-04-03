const User = require('../models/User');

// @desc    Search users by username, first or last name
const searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ users: [] });

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
};

// @desc    Get user profile by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('savedBlueprints', 'title category pricing')
      .select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get current authenticated user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('savedBlueprints', 'title category pricing')
      .select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update user profile
const updateProfile = async (req, res) => {
  try {
    if (req.params.id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updateFields = [
      'firstName', 'lastName', 'bio', 'avatar', 'role',
      'expertise', 'companyName', 'website', 'preferences',
    ];
    const updates = {};
    updateFields.forEach((field) => {
      if (req.body[field]) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user ratings and reviews
const getUserRatings = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      rating: user.metrics.rating,
      totalRatings: user.metrics.totalRatings,
      metrics: user.metrics,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Save blueprint to user's library
const saveBlueprint = async (req, res) => {
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
};

// @desc    Remove blueprint from user's saved list
const unsaveBlueprint = async (req, res) => {
  try {
    if (req.params.id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.params.id);
    user.savedBlueprints = user.savedBlueprints.filter(
      (bp) => bp.toString() !== req.params.blueprintId
    );
    await user.save();

    res.json({ message: 'Blueprint removed from saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  searchUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  getUserRatings,
  saveBlueprint,
  unsaveBlueprint,
};
