const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blueprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blueprint',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    default: 0
  },
  sellerEarnings: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'wallet', 'crypto'],
    default: 'stripe'
  },
  stripePaymentIntentId: String,
  walletTransaction: mongoose.Schema.Types.ObjectId,
  accessLevel: {
    type: String,
    enum: ['preview', 'full'],
    default: 'full'
  },
  expiresAt: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  refundedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
