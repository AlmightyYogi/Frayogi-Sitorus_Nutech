const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// const db = mysql.createConnection({
//     host: 'mysql.railway.internal',
//     user: 'root',
//     password: 'bOWHkvIrTtxiNfYSYrFekksFnmSdFirN',
//     database: 'railway'
//   });

db.connect(err => {
  if (err) {
    console.error('error connecting to db: ', err.stack);
  } else {
    console.log('connected to database');
  }
});

module.exports = db;
