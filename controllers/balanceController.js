const db = require('../config/db');

const getBalance = async (req, res) => {
  const userId = req.user.id;

  try {
    const [result] = await db.query('SELECT balance FROM balances WHERE user_id = ?', [userId]);

    if (result.length > 0) {
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

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

const createBalance = async (req, res) => {
  const userId = req.user.id;

  try {
    await db.query('INSERT INTO balances (user_id, balance) VALUES (?, 0)', [userId]);

    return res.status(201).json({
      status: 0,
      message: 'Balance created successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

const updateBalance = async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;

  try {
    await db.query('UPDATE balances SET balance = balance + ? WHERE user_id = ?', [amount, userId]);

    return res.status(200).json({
      status: 0,
      message: 'Balance updated successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

const deductBalance = async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;

  try {
    await db.query('UPDATE balances SET balance = balance - ? WHERE user_id = ?', [amount, userId]);

    return res.status(200).json({
      status: 0,
      message: 'Balance deducted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

module.exports = {
  getBalance,
  createBalance,
  updateBalance,
  deductBalance
};