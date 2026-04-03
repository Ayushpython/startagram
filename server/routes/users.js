const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  searchUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  getUserRatings,
  saveBlueprint,
  unsaveBlueprint,
} = require('../controllers/usersController');

const router = express.Router();

router.get('/search', authMiddleware, searchUsers);
router.get('/:id', getUserById);
router.get('/', authMiddleware, getCurrentUser);
router.put('/:id', authMiddleware, updateProfile);
router.get('/:id/ratings', getUserRatings);
router.post('/:id/save-blueprint', authMiddleware, saveBlueprint);
router.delete('/:id/unsave-blueprint/:blueprintId', authMiddleware, unsaveBlueprint);

module.exports = router;
