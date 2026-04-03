const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Blueprint = require('../models/Blueprint');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/transactions
// @desc    Create a transaction (purchase blueprint)
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { blueprintId, paymentMethod } = req.body;

    if (!blueprintId || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const blueprint = await Blueprint.findById(blueprintId);
    if (!blueprint) {
      return res.status(404).json({ error: 'Blueprint not found' });
    }

    const buyer = await User.findById(req.user.userId);
    const seller = await User.findById(blueprint.author);

    if (!buyer || !seller) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (buyer._id.toString() === seller._id.toString()) {
      return res.status(400).json({ error: 'Cannot purchase your own blueprint' });
    }

    const amount = blueprint.discountedPrice || blueprint.pricing;
    const platformFee = amount * 0.1; // 10% platform fee
    const sellerEarnings = amount - platformFee;

    const transaction = new Transaction({
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      buyer: req.user.userId,
      seller: blueprint.author,
      blueprint: blueprintId,
      amount,
      platformFee,
      sellerEarnings,
      paymentMethod,
      status: 'pending'
    });

    await transaction.save();

    // TODO: Process payment based on paymentMethod
    // For now, mark as completed
    transaction.status = 'completed';
    transaction.completedAt = new Date();
    await transaction.save();

    // Update seller wallet and metrics
    seller.wallet.balance += sellerEarnings;
    seller.wallet.totalEarnings += sellerEarnings;
    await seller.save();

    // Update buyer metrics
    buyer.metrics.blueprintsPurchased += 1;
    buyer.metrics.totalSpent += amount;
    await buyer.save();

    // Update blueprint sales metrics
    blueprint.sales.purchaseCount += 1;
    blueprint.sales.totalRevenue += sellerEarnings;
    blueprint.sales.lastSoldAt = new Date();
    await blueprint.save();

    res.status(201).json({
      message: 'Transaction completed successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get transaction details
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('buyer', 'firstName lastName email')
      .populate('seller', 'firstName lastName')
      .populate('blueprint', 'title pricing');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.buyer._id.toString() !== req.user.userId && transaction.seller._id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/transactions
// @desc    Get user transactions
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { role } = req.query;

    let filter = {};
    if (role === 'buyer') {
      filter.buyer = req.user.userId;
    } else if (role === 'seller') {
      filter.seller = req.user.userId;
    } else {
      filter = {
        $or: [
          { buyer: req.user.userId },
          { seller: req.user.userId }
        ]
      };
    }

    const transactions = await Transaction.find(filter)
      .populate('blueprint', 'title')
      .populate('buyer', 'firstName lastName')
      .populate('seller', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/transactions/:id/refund
// @desc    Refund a transaction
// @access  Private
router.post('/:id/refund', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.seller.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (transaction.status === 'refunded') {
      return res.status(400).json({ error: 'Transaction already refunded' });
    }

    transaction.status = 'refunded';
    transaction.refundedAt = new Date();
    await transaction.save();

    // Reverse earnings
    const seller = await User.findById(transaction.seller);
    seller.wallet.balance -= transaction.sellerEarnings;
    seller.wallet.totalEarnings -= transaction.sellerEarnings;
    await seller.save();

    res.json({
      message: 'Transaction refunded successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
