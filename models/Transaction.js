const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  service_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transaction_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'transactions',
});

module.exports = Transaction;
