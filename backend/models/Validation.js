const mongoose = require('mongoose');

const ValidationSchema = new mongoose.Schema({
  blueprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blueprint',
    required: true,
    unique: true
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  scores: {
    marketDemand: {
      type: Number,
      min: 0,
      max: 10
    },
    technicalFeasibility: {
      type: Number,
      min: 0,
      max: 10
    },
    monetization: {
      type: Number,
      min: 0,
      max: 10
    },
    competitiveAdvantage: {
      type: Number,
      min: 0,
      max: 10
    },
    team: {
      type: Number,
      min: 0,
      max: 10
    }
  },
  analysis: {
    summary: String,
    strengths: [String],
    weaknesses: [String],
    opportunities: [String],
    risks: [String]
  },
  marketComparables: [{
    company: String,
    fundingRaised: String,
    market: String
  }],
  aiModel: {
    type: String,
    enum: ['gpt-4', 'gpt-3.5', 'claude', 'custom'],
    default: 'gpt-4'
  },
  modelVersion: String,
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.8
  },
  flags: {
    highRisk: Boolean,
    lowMarketDemand: Boolean,
    technicalChallenges: Boolean,
    overSaturated: Boolean
  },
  recommendations: [String],
  validatedAt: {
    type: Date,
    default: Date.now
  },
  nextValidationDue: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Validation', ValidationSchema);
