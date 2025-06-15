const express = require('express');
const claimController = require('../controllers/claimController');
const validateBonusType = require('../middleware/validateBonusType');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// POST /claim-bonus route with middleware chain
router.post('/claim-bonus', 
  validateRequest,
  validateBonusType,
  claimController.claimBonus
);

module.exports = router;