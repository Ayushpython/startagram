const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/wallet/:userId
// @desc    Get user wallet details
// @access  Private
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.params.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.params.userId).select('wallet metrics');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      wallet: user.wallet,
      earnings: user.metrics.totalEarnings,
      spent: user.metrics.totalSpent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/wallet/:userId/add-funds
// @desc    Add funds to wallet (via Stripe)
// @access  Private
router.post('/:userId/add-funds', authMiddleware, async (req, res) => {
  try {
    if (req.params.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // TODO: Integrate Stripe payment processing
    const user = await User.findById(req.params.userId);
    user.wallet.balance += amount;
    await user.save();

    res.json({
      message: 'Funds added successfully',
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/wallet/:userId/withdraw
// @desc    Withdraw funds from wallet
// @access  Private
router.post('/:userId/withdraw', authMiddleware, async (req, res) => {
  try {
    if (req.params.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { amount, bankAccount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = await User.findById(req.params.userId);

    if (user.wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // TODO: Process bank transfer
    user.wallet.balance -= amount;
    await user.save();

    res.json({
      message: 'Withdrawal processed',
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
