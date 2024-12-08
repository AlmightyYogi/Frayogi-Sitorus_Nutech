const db = require('../config/db');

const makeTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { service_code } = req.body;

    if (!service_code) {
      return res.status(400).json({
        status: 102,
        message: 'Parameter tidak valid',
        data: null
      });
    }

    const [serviceResult] = await db.query(
      `SELECT * FROM services WHERE service_code = ?`,
      [service_code]
    );

    if (serviceResult.length === 0) {
      return res.status(400).json({
        status: 102,
        message: 'Service code tidak ditemukan',
        data: null
      });
    }

    const serviceTariff = serviceResult[0].service_tariff;

    const [balanceResult] = await db.query(
      `SELECT balance FROM balances WHERE user_id = ?`,
      [userId]
    );

    if (balanceResult.length === 0 || balanceResult[0].balance < serviceTariff) {
      return res.status(400).json({
        status: 101,
        message: 'Saldo anda tidak cukup',
        data: null
      });
    }

    await db.query(
      `UPDATE balances SET balance = balance - ? WHERE user_id = ?`,
      [serviceTariff, userId]
    );

    const invoiceNumber = `INV${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await db.query(
      `INSERT INTO transactions (user_id, service_code, transaction_type, description, total_amount, invoice_number)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, service_code, 'PAYMENT', `Payment for ${service_code}`, serviceTariff, invoiceNumber]
    );

    res.status(200).json({
      status: 0,
      message: 'Transaksi berhasil',
      data: {
        invoice_number: invoiceNumber,
        service_code: service_code,
        service_name: serviceResult[0].service_name,
        transaction_type: 'PAYMENT',
        total_amount: serviceTariff,
        created_on: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

module.exports = { makeTransaction };
