const Balance = require('../models/balanceModel');
const Transaction = require('../models/transactionModel');
const Service = require('../models/serviceModel');  // Menambahkan model untuk layanan

const makeTransaction = (req, res) => {
  const userId = req.user.id;
  const { service_code } = req.body;

  // Validasi input parameter
  if (!service_code) {
    return res.status(400).json({
      status: 102,
      message: 'Parameter tidak valid',
      data: null
    });
  }

  // Ambil informasi tarif layanan berdasarkan service_code
  Service.getServiceByCode(service_code, (err, serviceResult) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: 'Gagal mengambil informasi layanan',
        data: null
      });
    }

    if (serviceResult.length === 0) {
      return res.status(400).json({
        status: 102,
        message: 'Service code tidak ditemukan',
        data: null
      });
    }

    const serviceTariff = serviceResult[0].service_tariff;

    // Ambil saldo pengguna
    Balance.getBalanceByUserId(userId, (err, balanceResult) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: 'Gagal mengambil saldo',
          data: null
        });
      }

      // Cek apakah saldo mencukupi
      if (balanceResult.length === 0 || balanceResult[0].balance < serviceTariff) {
        return res.status(400).json({
          status: 101,
          message: 'Saldo anda tidak cukup',
          data: null
        });
      }

      // Kurangi saldo pengguna
      Balance.deductBalance(userId, serviceTariff, (err) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: 'Gagal mengurangi saldo',
            data: null
          });
        }

        // Buat nomor invoice unik
        const invoiceNumber = `INV${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Buat transaksi
        Transaction.createTransaction(userId, service_code, 'PAYMENT', `Payment for ${service_code}`, serviceTariff, invoiceNumber, (err) => {
          if (err) {
            return res.status(500).json({
              status: 500,
              message: 'Gagal membuat transaksi',
              data: null
            });
          }

          // Respons sukses
          return res.status(200).json({
            status: 0,
            message: 'Transaksi berhasil',
            data: {
              invoice_number: invoiceNumber,
              service_code: service_code,
              service_name: serviceResult[0].service_name,  // Nama layanan
              transaction_type: 'PAYMENT',
              total_amount: serviceTariff,
              created_on: new Date().toISOString()
            }
          });
        });
      });
    });
  });
};

module.exports = { makeTransaction };
