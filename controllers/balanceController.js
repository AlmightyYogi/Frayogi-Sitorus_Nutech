const Balance = require('../models/balanceModel');

const getBalance = (req, res) => {
  const userId = req.user.id;
  
  Balance.getBalanceByUserId(userId, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: null
      });
    }
    
    if (result && result.length > 0) {
      return res.status(200).json({
        status: 0,
        message: 'Get Balance Berhasil',
        data: {
          balance: result[0].balance
        }
      });
    }
    
    return res.status(404).json({
      status: 404,
      message: 'Balance not found',
      data: null
    });
  });
};

module.exports = { getBalance };
