const Balance = require('../models/balanceModel');
const Transaction = require('../models/transactionModel');

const topUp = (req, res) => {
  const userId = req.user.id;
  const { top_up_amount } = req.body;

  if (isNaN(top_up_amount) || top_up_amount <= 0) {
    return res.status(400).json({
      status: 102,
      message: 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
      data: null
    });
  }

  Balance.getBalanceByUserId(userId, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: null
      });
    }

    if (result.length === 0) {
      Balance.createBalance(userId, (err) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: 'Failed to create balance',
            data: null
          });
        }
        Balance.updateBalance(userId, top_up_amount, (err) => {
          if (err) {
            return res.status(500).json({
              status: 500,
              message: 'Failed to update balance',
              data: null
            });
          }
          createTopUpTransaction(userId, top_up_amount, res);
        });
      });
    } else {
      Balance.updateBalance(userId, top_up_amount, (err) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: 'Failed to update balance',
            data: null
          });
        }
        createTopUpTransaction(userId, top_up_amount, res);
      });
    }
  });
};

const createTopUpTransaction = (userId, top_up_amount, res) => {
  const invoiceNumber = `INV${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  Transaction.createTransaction(userId, 'TOPUP', 'TOPUP', 'Top Up balance', top_up_amount, invoiceNumber, (err) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: 'Failed to create transaction',
        data: null
      });
    }

    return res.status(200).json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: {
        balance: top_up_amount
      }
    });
  });
};

module.exports = { topUp };
