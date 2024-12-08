const db = require('../config/db');

const Balance = {
  getBalanceByUserId: (userId, callback) => {
    const query = 'SELECT balance FROM balances WHERE user_id = ?';
    db.query(query, [userId], callback);
  },

  createBalance: (userId, callback) => {
    const query = 'INSERT INTO balances (user_id, balance) VALUES (?, 0)';
    db.query(query, [userId], callback);
  },

  updateBalance: (userId, amount, callback) => {
    const query = 'UPDATE balances SET balance = balance + ? WHERE user_id = ?';
    db.query(query, [amount, userId], callback);
  },

  deductBalance: (userId, amount, callback) => {
    const query = 'UPDATE balances SET balance = balance - ? WHERE user_id = ?';
    db.query(query, [amount, userId], callback);
  }
};

module.exports = Balance;
