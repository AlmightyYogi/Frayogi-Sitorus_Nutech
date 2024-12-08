const mysql2 = require('mysql2');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,      // Nama database
    process.env.DB_USER,      // Username database
    process.env.DB_PASSWORD,  // Password database
    {
        host: process.env.DB_HOST, // Host database
        dialect: 'mysql',      // Dialek yang digunakan
        dialectModule: mysql2, // Dialek MySQL
        port: process.env.DB_PORT, // Port database
        logging: false,       // Menonaktifkan logging query SQL
        pool: {
            max: 5,           // Maksimum koneksi dalam pool
            min: 0,           // Minimum koneksi dalam pool
            acquire: 60000,   // Waktu maksimal untuk mendapatkan koneksi
            idle: 10000,      // Waktu idle sebelum koneksi di-terminate
        },
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL database successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
