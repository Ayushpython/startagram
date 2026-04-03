const mongoose = require('mongoose');

const BlueprintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['B2B', 'B2C', 'SaaS', 'Marketplace', 'Social', 'AI', 'FinTech', 'HealthTech', 'EdTech', 'Other'],
    required: true
  },
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'sold_out', 'archived'],
    default: 'draft'
  },
  content: {
    problemStatement: {
      type: String,
      required: true
    },
    targetAudience: [{
      segment: String,
      description: String,
      size: String
    }],
    marketResearch: {
      marketSize: String,
      competitors: [String],
      trends: [String]
    },
    features: [{
      name: String,
      description: String,
      priority: {
        type: String,
        enum: ['mvp', 'important', 'nice-to-have']
      }
    }],
    monetizationStrategy: {
      model: String,
      projectedRevenue: String,
      pricingTier: String
    },
    timeline: {
      mvpTimeline: String,
      launchTimeline: String
    },
    resources: [{
      type: String,
      url: String
    }]
  },
  pricing: {
    type: Number,
    required: true,
    min: 0
  },
  discountedPrice: {
    type: Number,
    default: null
  },
  currency: {
    type: String,
    default: 'USD'
  },
  isProtected: {
    type: Boolean,
    default: false
  },
  protectionLevel: {
    type: String,
    enum: ['none', 'partial', 'full'],
    default: 'none'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'public'
  },
  accessControl: {
    approvedBuyers: [mongoose.Schema.Types.ObjectId],
    blockedUsers: [mongoose.Schema.Types.ObjectId]
  },
  validation: {
    score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    scoredAt: Date,
    validationDetails: {
      marketDemandScore: Number,
      technicalFeasibilityScore: Number,
      monetizationScore: Number,
      competitiveAdvantageScore: Number
    }
  },
  sales: {
    purchaseCount: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    lastSoldAt: Date
  },
  engagement: {
    viewCount: {
      type: Number,
      default: 0
    },
    savedCount: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    reviewer: mongoose.Schema.Types.ObjectId,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  collaborationOffers: [{
    from: mongoose.Schema.Types.ObjectId,
    message: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  media: {
    thumbnail: String,
    attachments: [String]
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

module.exports = mongoose.model('Blueprint', BlueprintSchema);
