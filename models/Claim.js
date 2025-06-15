const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true,
    index: true
  },
  bonusType: {
    type: String,
    required: [true, 'Bonus type is required'],
    enum: {
      values: ['DAILY', 'WELCOME', 'EVENT'],
      message: 'Bonus type must be one of: DAILY, WELCOME, EVENT'
    },
    index: true
  },
  claimedAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  metadata: {
    ipAddress: String,
    userAgent: String
  }
}, {
  timestamps: true,
  versionKey: false
});

// Compound index for efficient queries
claimSchema.index({ userId: 1, bonusType: 1, claimedAt: -1 });

// Instance method to check if claim is from today
claimSchema.methods.isFromToday = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return this.claimedAt >= today;
};

// Static method to get user's claims
claimSchema.statics.getUserClaims = function(userId, bonusType = null, limit = 10) {
  const query = { userId };
  if (bonusType) query.bonusType = bonusType;
  
  return this.find(query)
    .sort({ claimedAt: -1 })
    .limit(limit);
};

// Static method to check if user can claim daily bonus
claimSchema.statics.canClaimDaily = async function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingClaim = await this.findOne({
    userId,
    bonusType: 'DAILY',
    claimedAt: { $gte: today }
  });
  
  return !existingClaim;
};

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;