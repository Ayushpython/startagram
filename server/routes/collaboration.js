const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  createCollaboration,
  getCollaboration,
  getCollaborations,
  acceptCollaboration,
  rejectCollaboration,
} = require('../controllers/collaborationController');

const router = express.Router();

router.post('/', authMiddleware, createCollaboration);
router.get('/:id', authMiddleware, getCollaboration);
router.get('/', authMiddleware, getCollaborations);
router.put('/:id/accept', authMiddleware, acceptCollaboration);
router.put('/:id/reject', authMiddleware, rejectCollaboration);

module.exports = router;
