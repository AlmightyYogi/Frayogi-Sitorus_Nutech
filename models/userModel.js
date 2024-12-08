const db = require('../config/db');

const User = {
  findById: (id, callback) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      if (!results.length) return callback(null, null);
      return callback(null, results[0]);
    });
  },

  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return callback(err);
      if (!results.length) return callback(null, null);
      return callback(null, results[0]);
    });
  },

  create: (email, first_name, last_name, password, callback) => {
    db.query('INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)', [email, first_name, last_name, password], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  updateProfile: (id, first_name, last_name, callback) => {
    db.query('UPDATE users SET first_name = ?, last_name = ? WHERE id = ?', [first_name, last_name, id], (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  },

  updateProfileImage: (id, profile_image, callback) => {
    db.query('UPDATE users SET profile_image = ? WHERE id = ?', [profile_image, id], (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  }
};

module.exports = User;
