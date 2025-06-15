const config = require('../config/config');
const { AppError } = require('../utils/errors');

const validateBonusType = (req, res, next) => {
  try {
    const { bonusType } = req.body;

    if (!bonusType) {
      throw new AppError('Bonus type is required', 400);
    }

    // Check if bonusType is allowed
    if (!config.allowedBonusTypes.includes(bonusType)) {
      throw new AppError(
        `Invalid bonus type. Allowed types are: ${config.allowedBonusTypes.join(', ')}`,
        400
      );
    }

    // Normalize bonus type to uppercase
    req.body.bonusType = bonusType.toUpperCase();

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateBonusType;