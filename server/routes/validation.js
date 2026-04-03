const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  getValidation,
  generateValidation,
  getMarketComparables,
} = require('../controllers/validationController');

const router = express.Router();

router.get('/:blueprintId', getValidation);
router.post('/:blueprintId/generate', authMiddleware, generateValidation);
router.get('/market-comparables', getMarketComparables);

module.exports = router;
