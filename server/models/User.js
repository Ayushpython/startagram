const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['creator', 'builder', 'both'],
    default: 'both'
  },
  expertise: [String],
  companyName: String,
  website: String,
  socialLinks: {
    twitter: String,
    linkedin: String,
    github: String
  },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'verified', 'premium'],
    default: 'unverified'
  },
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    stripeCustomerId: String
  },
  metrics: {
    blueprintsCreated: {
      type: Number,
      default: 0
    },
    blueprintsPurchased: {
      type: Number,
      default: 0
    },
    collaborationsInitiated: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    blueprintRecommendations: {
      type: Boolean,
      default: true
    },
    collaborationRequests: {
      type: Boolean,
      default: true
    }
  },
  savedBlueprints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blueprint'
  }],
  isActive: {
    type: Boolean,
    default: true
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

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
