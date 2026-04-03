const express = require('express');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');
const {
  createBlueprint,
  getBlueprints,
  getBlueprint,
  updateBlueprint,
  deleteBlueprint,
  publishBlueprint,
  getBlueprintsByAuthor,
} = require('../controllers/blueprintsController');

const router = express.Router();

router.post('/', authMiddleware, createBlueprint);
router.get('/', optionalAuthMiddleware, getBlueprints);
router.get('/:id', optionalAuthMiddleware, getBlueprint);
router.put('/:id', authMiddleware, updateBlueprint);
router.delete('/:id', authMiddleware, deleteBlueprint);
router.post('/:id/publish', authMiddleware, publishBlueprint);
router.get('/author/:authorId', getBlueprintsByAuthor);

module.exports = router;
