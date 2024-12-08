const db = require('../config/db');

const Transaction = {
  createTransaction: (userId, serviceCode, transactionType, description, totalAmount, invoiceNumber, callback) => {
    const query = 
      `INSERT INTO transactions (user_id, service_code, transaction_type, description, total_amount, invoice_number)
      VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [userId, serviceCode, transactionType, description, totalAmount, invoiceNumber], callback);
  },

  getTransactionHistory: (userId, offset, limit, callback) => {
    const query = 
      `SELECT * FROM transactions WHERE user_id = ? ORDER BY created_on DESC LIMIT ?, ?`;
    db.query(query, [userId, offset, limit], callback);
  }
};

module.exports = Transaction;
