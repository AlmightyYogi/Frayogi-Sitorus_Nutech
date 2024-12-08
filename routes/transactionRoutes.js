const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getBalance } = require('../controllers/balanceController');
const { topUp } = require('../controllers/topupController');
const { makeTransaction } = require('../controllers/transactionController');
const { getHistory } = require('../controllers/historyController');

router.get('/balance', authMiddleware, getBalance);
router.post('/topup', authMiddleware, topUp);
router.post('/transaction', authMiddleware, makeTransaction);
router.get('/transaction/history', authMiddleware, getHistory);

module.exports = router;
