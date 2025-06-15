const Claim = require('../models/Claim');
const VaultLogger = require('../utils/VaultLogger');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

const claimController = {
  claimBonus: async (req, res, next) => {
    try {
      const { userId, bonusType } = req.body;

      // Check if user has already claimed this bonus type today (for DAILY bonus)
      if (bonusType === 'DAILY') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const existingClaim = await Claim.findOne({
          userId,
          bonusType: 'DAILY',
          claimedAt: { $gte: today }
        });

        if (existingClaim) {
          throw new AppError('Daily bonus already claimed today', 409);
        }
      }

      // Create new claim record
      const newClaim = new Claim({
        userId,
        bonusType,
        claimedAt: new Date(),
        metadata: {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      // Save to database
      const savedClaim = await newClaim.save();

      // Call the fake logger function as required
      VaultLogger.logClaim(userId, bonusType, savedClaim.claimedAt);

      // Log successful claim
      logger.info(`Bonus claimed successfully - User: ${userId}, Type: ${bonusType}, ID: ${savedClaim._id}`);

      // Return success response
      res.status(201).json({
        success: true,
        message: 'Bonus claimed successfully',
        data: {
          claimId: savedClaim._id,
          userId: savedClaim.userId,
          bonusType: savedClaim.bonusType,
          claimedAt: savedClaim.claimedAt
        }
      });

    } catch (error) {
      logger.error(`Error claiming bonus - User: ${req.body?.userId}, Type: ${req.body?.bonusType}, Error: ${error.message}`);
      next(error);
    }
  }
};

module.exports = claimController;