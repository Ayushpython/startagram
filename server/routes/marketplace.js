const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  searchBlueprints,
  getCategories,
  getTrending,
  getRecommendations,
  rateBlueprint,
} = require('../controllers/marketplaceController');

const router = express.Router();

router.get('/search', searchBlueprints);
router.get('/categories', getCategories);
router.get('/trending', getTrending);
router.get('/recommendations', authMiddleware, getRecommendations);
router.post('/:blueprintId/rate', authMiddleware, rateBlueprint);

module.exports = router;
