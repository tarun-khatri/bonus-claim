const { AppError } = require('../utils/errors');

const validateRequest = (req, res, next) => {
  try {
    const { userId, bonusType } = req.body;

    // Validate required fields
    if (!userId || userId.trim() === '') {
      throw new AppError('User ID must be a non-empty string', 400);
    }

    if (!bonusType || bonusType.trim() === '') {
      throw new AppError('Bonus type must be a non-empty string', 400);
    }

    // Validate userId format (basic validation)
    if (typeof userId !== 'string' || userId.trim().length === 0) {
      throw new AppError('User ID must be a non-empty string', 400);
    }

    // Validate bonusType format
    if (typeof bonusType !== 'string' || bonusType.trim().length === 0) {
      throw new AppError('Bonus type must be a non-empty string', 400);
    }

    // Sanitize inputs
    req.body.userId = userId.trim();
    req.body.bonusType = bonusType.trim().toUpperCase();

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateRequest;