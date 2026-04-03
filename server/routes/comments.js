const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  createComment,
  getCommentsByBlueprint,
  updateComment,
  deleteComment,
  likeComment,
} = require('../controllers/commentsController');

const router = express.Router();

router.post('/', authMiddleware, createComment);
router.get('/:blueprintId', getCommentsByBlueprint);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);
router.post('/:id/like', authMiddleware, likeComment);

module.exports = router;
