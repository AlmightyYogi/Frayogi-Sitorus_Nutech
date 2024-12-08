const mysql = require('mysql2');

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'nutech'
// });

const db = mysql.createConnection({
    host: 'mysql.railway.internal',
    user: 'root',
    password: 'bOWHkvIrTtxiNfYSYrFekksFnmSdFirN',
    database: 'railway'
  });

db.connect(err => {
  if (err) {
    console.error('error connecting to db: ', err.stack);
  } else {
    console.log('connected to database');
  }
});

module.exports = db;
