const db = require('../config/db');

const topUp = async (req, res) => {
  const userId = req.user.id;
  const { top_up_amount } = req.body;

  if (isNaN(top_up_amount) || top_up_amount <= 0) {
    return res.status(400).json({
      status: 102,
      message: 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
      data: null
    });
  }

  try {
    const [existingBalance] = await db.query('SELECT balance FROM balances WHERE user_id = ?', [userId]);

    if (existingBalance.length === 0) {
      await db.query('INSERT INTO balances (user_id, balance) VALUES (?, ?)', [userId, top_up_amount]);
    } else {
      await db.query('UPDATE balances SET balance = balance + ? WHERE user_id = ?', [top_up_amount, userId]);
    }

    const invoiceNumber = `INV${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await db.query(
      'INSERT INTO transactions (user_id, service_code, transaction_type, description, total_amount, invoice_number) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, 'TOPUP', 'TOPUP', 'Top Up balance', top_up_amount, invoiceNumber]
    );

    return res.status(200).json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: {
        balance: top_up_amount
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

module.exports = { topUp };
