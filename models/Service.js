const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  service_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  service_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  service_icon: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  service_tariff: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'services',
});

module.exports = Service;
