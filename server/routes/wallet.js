const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getWallet, addFunds, withdraw } = require('../controllers/walletController');

const router = express.Router();

router.get('/:userId', authMiddleware, getWallet);
router.post('/:userId/add-funds', authMiddleware, addFunds);
router.post('/:userId/withdraw', authMiddleware, withdraw);

module.exports = router;
