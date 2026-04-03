const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  createTransaction,
  getTransaction,
  getTransactions,
  refundTransaction,
} = require('../controllers/transactionsController');

const router = express.Router();

router.post('/', authMiddleware, createTransaction);
router.get('/:id', authMiddleware, getTransaction);
router.get('/', authMiddleware, getTransactions);
router.post('/:id/refund', authMiddleware, refundTransaction);

module.exports = router;
