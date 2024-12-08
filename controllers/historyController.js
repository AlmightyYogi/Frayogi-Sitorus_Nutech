const Transaction = require('../models/transactionModel');

// Get transaction history
const getHistory = (req, res) => {
  const userId = req.user.id;
  const { limit = 3, offset = 0 } = req.query;

  Transaction.getTransactionHistory(userId, parseInt(offset), parseInt(limit), (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: null
      });
    }

    return res.status(200).json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset: parseInt(offset),
        limit: parseInt(limit),
        records: result
      }
    });
  });
};

module.exports = { getHistory };
