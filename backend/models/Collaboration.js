const mongoose = require('mongoose');

const CollaborationSchema = new mongoose.Schema({
  blueprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blueprint',
    required: true
  },
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    trim: true
  },
  collaborationType: {
    type: String,
    enum: ['co-founder', 'developer', 'designer', 'marketer', 'advisor', 'investor', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  terms: {
    equity: String,
    role: String,
    commitment: String
  },
  acceptedAt: Date,
  rejectedAt: Date,
  rejectionReason: String,
  workspace: {
    slackChannel: String,
    documentLink: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Collaboration', CollaborationSchema);
